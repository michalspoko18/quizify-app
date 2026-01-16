// src/store/auth.js — Enhanced Authentication with Cookie Storage
import { reactive } from 'vue'
import { authCookies } from '../utils/cookies.js'
import { authAPI } from '../services/api.js'

const state = reactive({ 
  account: null, 
  nick: null, 
  idToken: null,
  refreshToken: null,
  isInitialized: false,
  permissions: [],
  lastActivity: null
})

let gisReady = false
let clientId = null
let refreshTokenTimer = null

function decodeJwt(token){
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

function nickKey(sub){ return `quizapp:nick:${sub}` }
function loadNick(sub){ return localStorage.getItem(nickKey(sub)) }
function saveNick(sub,v){ localStorage.setItem(nickKey(sub), v) }

// Token refresh logic
async function refreshAccessToken() {
  try {
    const response = await authAPI.refreshToken()
    const { accessToken, refreshToken: newRefreshToken } = response.data
    
    // Update tokens in cookies
    authCookies.setAuthTokens(accessToken, newRefreshToken)
    state.idToken = accessToken
    state.refreshToken = newRefreshToken
    
    // Schedule next refresh
    scheduleTokenRefresh(accessToken)
    
    return accessToken
  } catch (error) {
    console.error('Token refresh failed:', error)
    // If refresh fails, logout user
    await logout()
    throw error
  }
}

// Schedule automatic token refresh
function scheduleTokenRefresh(token) {
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
  }
  
  const payload = decodeJwt(token)
  if (payload && payload.exp) {
    // Refresh 5 minutes before expiry
    const refreshTime = (payload.exp * 1000) - Date.now() - (5 * 60 * 1000)
    
    if (refreshTime > 0) {
      refreshTokenTimer = setTimeout(async () => {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Automatic token refresh failed:', error)
        }
      }, refreshTime)
    }
  }
}

// Load user session from cookies
function loadSessionFromCookies() {
  const token = authCookies.getAccessToken()
  const userData = authCookies.getUserData()
  
  if (token && userData) {
    const payload = decodeJwt(token)
    
    // Check if token is still valid
    if (payload && payload.exp * 1000 > Date.now()) {
      state.account = {
        sub: userData.sub || payload.sub,
        email: userData.email || payload.email,
        name: userData.name || payload.name,
        picture: userData.picture || payload.picture,
      }
      state.idToken = token
      state.nick = userData.nick || loadNick(userData.sub || payload.sub)
      state.permissions = userData.permissions || []
      state.lastActivity = Date.now()
      
      // Schedule token refresh
      scheduleTokenRefresh(token)
      
      return true
    } else {
      // Token expired, clear cookies
      authCookies.clearAuthCookies()
    }
  }
  
  return false
}

console.log('VITE_GOOGLE_CLIENT_ID =', import.meta.env.VITE_GOOGLE_CLIENT_ID)

export async function ensureSession(){
  if (state.isInitialized) {
    return state.account !== null
  }

  // First try to load from cookies (Google token flow)
  const hasValidCookieSession = loadSessionFromCookies()
  
  if (hasValidCookieSession) {
    state.isInitialized = true
    return true
  }

  // Fallback to sessionStorage (for backward compatibility)
  const stored = sessionStorage.getItem('quizapp:idtoken')
  if (stored) {
    const p = decodeJwt(stored)
    if (p && p.exp * 1000 > Date.now()) {
      state.account = { sub: p.sub, email: p.email, name: p.name, picture: p.picture }
      state.idToken = stored
      state.nick = loadNick(p.sub) || null
      
      // Migrate to cookie storage
      const userData = {
        sub: p.sub,
        email: p.email,
        name: p.name,
        picture: p.picture,
        nick: state.nick,
        permissions: []
      }
      
      authCookies.setAuthTokens(stored, 'dummy_refresh_token') // We don't have refresh token from Google
      authCookies.setUserData(userData)
      
      // Clear old storage
      sessionStorage.removeItem('quizapp:idtoken')
      
      state.isInitialized = true
      return true
    } else {
      // Remove expired token
      sessionStorage.removeItem('quizapp:idtoken')
    }
  }

  // Try backend session-based auth (email/password login uses Django session cookie)
  try {
    const response = await authAPI.me()
    const data = response?.data
    if (data && data.id) {
      state.account = {
        sub: String(data.id),
        email: data.email,
        name: data.nick || data.email,
        picture: null,
      }
      state.idToken = null
      state.refreshToken = null
      state.nick = data.nick || null
      state.permissions = data.permissions || []
      state.lastActivity = Date.now()

      state.isInitialized = true
      return true
    }
  } catch (e) {
    // not logged in via session
  }

  // Google login is optional: don't fail the whole app when missing
  clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    console.warn('Brak VITE_GOOGLE_CLIENT_ID — Google login disabled')
    state.isInitialized = true
    return false
  }

  // Initialize Google Identity Services
  if (!gisReady) {
    await new Promise(r => {
      if (window.google?.accounts?.id) return r()
      const i = setInterval(()=>{ if (window.google?.accounts?.id){ clearInterval(i); r() } }, 30)
      setTimeout(()=>{ clearInterval(i); r() }, 5000)
    })
    gisReady = !!window.google?.accounts?.id
  }

  state.isInitialized = true
  return false
}

export async function login() {
  await ensureSession();

  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!client_id) {
    throw new Error('Brak konfiguracji Google Client ID');
  }

  // Sprawdź, czy biblioteka GIS jest załadowana
  if (!window.google?.accounts?.id) {
    throw new Error('Google Identity Services nie zostało załadowane');
  }

  return new Promise((resolve, reject) => {
    let isResolved = false;
    
    // Krótszy timeout - 10 sekund, po tym czasie uznajemy że użytkownik anulował
    const timeout = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        reject(new Error('Logowanie zostało anulowane lub przerwane'));
      }
    }, 10000); // 10 sekund timeout

    const handleSuccess = () => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        resolve();
      }
    };

    const handleError = (error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeout);
        reject(error);
      }
    };

    // Inicjalizacja z callback
    window.google.accounts.id.initialize({
      client_id,
      callback: (resp) => {
        try {
          const payload = decodeJwt(resp.credential);
          if (!payload) {
            handleError(new Error('Nieprawidłowy token Google'));
            return;
          }

          state.account = {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
          };
          state.idToken = resp.credential;
          state.nick = loadNick(payload.sub) || null;
          state.lastActivity = Date.now();
          
          // Store in secure cookies instead of sessionStorage
          const userData = {
            sub: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            nick: state.nick,
            permissions: []
          }
          
          authCookies.setAuthTokens(resp.credential, 'google_token') // Google doesn't provide refresh token in ID flow
          authCookies.setUserData(userData)
          
          // Schedule token refresh if possible
          scheduleTokenRefresh(resp.credential)

          console.log('Zalogowano:', payload.email);
          handleSuccess();
        } catch (error) {
          handleError(error);
        }
      }
    });

    // Najpierw spróbuj One Tap
    window.google.accounts.id.prompt((notification) => {
      console.log('Google prompt status:', notification.getMomentType?.(), notification.getDismissedReason?.());
      
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Jeśli One Tap się nie wyświetlił, użyj popup przez tymczasowy przycisk
        try {
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
          
          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
            type: 'standard'
          });
          
          // Kliknij przycisk programowo po krótkim delay
          setTimeout(() => {
            const button = tempDiv.querySelector('div[role="button"]');
            if (button) {
              button.click();
            } else {
              handleError(new Error('Nie udało się otworzyć okna logowania Google'));
            }
            
            // Usuń tymczasowy element
            setTimeout(() => {
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
              }
            }, 1000);
          }, 100);
          
        } catch (error) {
          handleError(new Error('Błąd podczas otwierania okna logowania Google'));
        }
      }
    });
  });
}



export async function logout(){
  // Clear Google session
  window.google?.accounts?.id?.disableAutoSelect?.()
  
  // Clear refresh token timer
  if (refreshTokenTimer) {
    clearTimeout(refreshTokenTimer)
    refreshTokenTimer = null
  }
  
  // Clear cookies and storage
  authCookies.clearAuthCookies()
  sessionStorage.removeItem('quizapp:idtoken')
  
  // Reset state
  state.account = null
  state.idToken = null
  state.refreshToken = null
  state.nick = null
  state.permissions = []
  state.lastActivity = null
  
  // API logout wyłączone - aplikacja działa w trybie mock (bez backendu)
  // try {
  //   await authAPI.logout()
  // } catch (error) {
  //   console.warn('Logout API call failed:', error)
  // }
}

export function setNick(v){
  if (!state.account) return
  const s = (v || '').trim()
  if (s.length < 3 || s.length > 24) throw new Error('Nick musi mieć 3–24 znaki.')
  
  // Save to localStorage and state
  saveNick(state.account.sub, s)
  state.nick = s
  
  // Update cookie with new nick
  const currentUserData = authCookies.getUserData()
  if (currentUserData) {
    authCookies.setUserData({
      ...currentUserData,
      nick: s
    })
  }
}

// Activity tracking for automatic logout
function updateLastActivity() {
  state.lastActivity = Date.now()
}

// Check for inactivity and auto-logout
function checkInactivity() {
  const MAX_INACTIVITY = 30 * 60 * 1000 // 30 minutes
  
  if (state.lastActivity && Date.now() - state.lastActivity > MAX_INACTIVITY) {
    console.log('User inactive for too long, logging out...')
    logout()
    return false
  }
  return true
}

// Set up activity listeners
if (typeof window !== 'undefined') {
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, updateLastActivity, { passive: true })
  })
  
  // Check inactivity every 5 minutes
  setInterval(checkInactivity, 5 * 60 * 1000)
}

export function useAuth(){
  return {
    store: {
      get account(){ return state.account },
      get username(){ return state.account?.email },
      get name(){ return state.account?.name },
      get sub(){ return state.account?.sub },
      get nick(){ return state.nick },
      get token(){ return state.idToken },
      get refreshToken(){ return state.refreshToken },
      get isAuth(){ return !!state.account },
      get isInitialized(){ return state.isInitialized },
      get permissions(){ return state.permissions },
      get lastActivity(){ return state.lastActivity },
      
      // Role/permission checks
      hasPermission(permission) {
        return state.permissions.includes(permission)
      },
      
      hasAnyPermission(permissions) {
        return permissions.some(p => state.permissions.includes(p))
      },
      
      hasAllPermissions(permissions) {
        return permissions.every(p => state.permissions.includes(p))
      }
    },
    ensureSession, 
    login, 
    logout, 
    setNick,
    refreshAccessToken,
    updateLastActivity,
    checkInactivity
  }
}
