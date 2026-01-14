# 🏗️ Architecture Documentation

## Overview

Quizify App is a modern single-page application (SPA) built using Vue 3 with the Composition API. The architecture follows a modular, component-based design pattern with clear separation of concerns.

## Table of Contents

- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Routing Architecture](#routing-architecture)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [API Communication](#api-communication)
- [Security Architecture](#security-architecture)
- [Performance Considerations](#performance-considerations)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │            Quizify Vue 3 Application               │     │
│  │                                                      │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │     │
│  │  │  Components  │  │    Router    │  │  Store   │ │     │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │     │
│  │                                                      │     │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │     │
│  │  │  Services    │  │ Composables  │  │  Utils   │ │     │
│  │  └──────────────┘  └──────────────┘  └──────────┘ │     │
│  └────────────────────────────────────────────────────┘     │
│                            ↕                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Axios HTTP Client                      │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────────────┬─────────────────────────────┘
                                 ↕
┌───────────────────────────────┴─────────────────────────────┐
│                    Backend API Server                        │
│                  (FastAPI / Django / etc.)                   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Layer Structure

The application follows a layered architecture:

1. **Presentation Layer** (Views & Components)
   - User interface components
   - View components for routing
   - Reusable UI components

2. **Business Logic Layer** (Services & Composables)
   - API communication services
   - Business logic composables
   - Data transformation

3. **State Management Layer** (Store)
   - Authentication state
   - Error handling state
   - Application-wide state

4. **Routing Layer** (Router)
   - Route definitions
   - Navigation guards
   - Route-based code splitting

5. **Utility Layer** (Utils)
   - Cookie management
   - Helper functions
   - Common utilities

### Technology Stack

```yaml
Framework: Vue 3.5.22
  - Composition API
  - Script Setup syntax
  - Reactive system
  
Build Tool: Vite 5.4.8
  - Hot Module Replacement (HMR)
  - Fast builds
  - Optimized bundling

Routing: Vue Router 4.6.3
  - SPA routing
  - Route guards
  - Navigation middleware

HTTP Client: Axios 1.12.2
  - Request/response interceptors
  - Error handling
  - Cookie support

Authentication: 
  - Google Identity Services
  - @azure/msal-browser 3.30.0
  - Custom session management

UI Framework: Bootstrap 5.3.3
  - Dark theme
  - Responsive grid
  - Component styling
```

## Component Structure

### Component Hierarchy

```
App.vue (Root)
├── NavBar.vue (Navigation)
├── RouterView (Dynamic content)
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── QuizListView.vue
│   ├── QuizView.vue
│   ├── CreateView.vue
│   ├── RankingView.vue
│   ├── RegisterView.vue
│   └── AdminView.vue
├── NickPanel.vue (Modal)
├── ErrorNotifications.vue (Global)
└── SessionDebug.vue (Dev only)
```

### Component Types

#### 1. **View Components** (`/src/views`)
- Represent full pages
- Handle routing
- Compose smaller components
- Manage page-level state

Examples:
- `HomeView.vue` - Landing page
- `QuizView.vue` - Quiz-taking interface
- `CreateView.vue` - Quiz creation form

#### 2. **Layout Components** (`/src/components`)
- Provide structure
- Reusable across views
- Handle global state

Examples:
- `NavBar.vue` - Top navigation
- `ErrorNotifications.vue` - Toast notifications

#### 3. **UI Components** (`/src/components`)
- Reusable UI elements
- Self-contained functionality
- Props-based configuration

Examples:
- `NickPanel.vue` - Nickname setup modal
- `SessionDebug.vue` - Debug panel

## State Management

### Reactive Store Pattern

Instead of Pinia or Vuex, the application uses a lightweight reactive store pattern:

```javascript
// src/store/auth.js
import { reactive } from 'vue'

const state = reactive({
  account: null,
  nick: null,
  idToken: null,
  refreshToken: null,
  isInitialized: false,
  permissions: [],
  lastActivity: null
})

// Computed properties
const isAuth = computed(() => !!state.account)
const hasPermission = (permission) => {
  return state.permissions.includes(permission)
}

// Actions
async function login() { /* ... */ }
async function logout() { /* ... */ }

export function useAuth() {
  return {
    store: readonly(state),
    login,
    logout,
    hasPermission
  }
}
```

### Store Modules

1. **Authentication Store** (`auth.js`)
   - User authentication state
   - Token management
   - Permission checking
   - Google OAuth integration

2. **Error Store** (`errors.js`)
   - Global error handling
   - Error notifications
   - Error queue management

### State Persistence

- **Session Tokens**: Stored in secure HTTP-only cookies
- **User Data**: Stored in regular cookies (non-sensitive)
- **Nicknames**: Stored in localStorage (per user)
- **Activity Tracking**: Managed in memory

## Routing Architecture

### Route Structure

```javascript
// src/router/index.js
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/quizzes',
    name: 'quizzes',
    component: QuizListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/quiz/:id',
    name: 'quiz',
    component: QuizView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { 
      requiresAuth: true,
      permissions: ['admin']
    }
  }
]
```

### Navigation Guards

The application implements multiple levels of navigation guards:

#### 1. **Global Before Guards**
```javascript
router.beforeEach(async (to, from, next) => {
  // Initialize authentication state
  await auth.initialize()
  
  // Check authentication requirements
  if (to.meta.requiresAuth && !auth.store.isAuth) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  
  // Check permission requirements
  if (to.meta.permissions) {
    const hasAccess = to.meta.permissions.some(p => 
      auth.hasPermission(p)
    )
    if (!hasAccess) {
      return next({ name: 'home' })
    }
  }
  
  next()
})
```

#### 2. **Guest-Only Guards**
- Redirect authenticated users away from login/register pages
- Prevent unnecessary authentication flows

#### 3. **Permission Guards**
- Role-based access control
- Fine-grained permission checking
- Flexible permission requirements (AND/OR logic)

### Route Meta Fields

```javascript
meta: {
  requiresAuth: boolean,           // Requires authentication
  guestOnly: boolean,               // Only for non-authenticated users
  permissions: string[],            // Required permissions
  requireAllPermissions: boolean,   // AND vs OR logic
  title: string                     // Page title
}
```

## Authentication Flow

### Google OAuth Flow

```
┌─────────┐                  ┌──────────┐                  ┌─────────┐
│ Browser │                  │  Quizify │                  │ Google  │
│         │                  │   App    │                  │  OAuth  │
└────┬────┘                  └────┬─────┘                  └────┬────┘
     │                            │                             │
     │ 1. Click "Sign in"         │                             │
     │──────────────────────────>│                             │
     │                            │ 2. Initialize OAuth         │
     │                            │────────────────────────────>│
     │                            │                             │
     │                            │ 3. Return auth URL          │
     │                            │<────────────────────────────│
     │ 4. Redirect to Google      │                             │
     │────────────────────────────────────────────────────────>│
     │                            │                             │
     │ 5. User authenticates      │                             │
     │<────────────────────────────────────────────────────────│
     │                            │                             │
     │ 6. Callback with token     │                             │
     │<───────────────────────────────────────────────────────│
     │                            │                             │
     │ 7. Send token to app       │                             │
     │──────────────────────────>│                             │
     │                            │ 8. Validate token           │
     │                            │────────────────────────────>│
     │                            │                             │
     │                            │ 9. User info                │
     │                            │<────────────────────────────│
     │                            │                             │
     │                            │ 10. Store in cookies        │
     │                            │                             │
     │ 11. Redirect to app        │                             │
     │<──────────────────────────│                             │
```

### Session Management

1. **Token Storage**
   - Access Token: 15-minute expiry, stored in cookie
   - Refresh Token: 7-day expiry, stored in HTTP-only cookie
   - User Data: Stored in regular cookie

2. **Token Refresh**
   - Automatic refresh 5 minutes before expiry
   - Silent renewal (no user interaction)
   - Fallback to login on failure

3. **Activity Tracking**
   - Track mouse moves, clicks, scrolls
   - 30-minute inactivity timeout
   - Automatic logout on timeout

4. **Session Persistence**
   - Survives page refresh
   - Cross-tab synchronization (via cookies)
   - Backward compatibility with sessionStorage

## Data Flow

### Unidirectional Data Flow

```
┌──────────────────────────────────────────────────────┐
│                    User Action                        │
└────────────────────┬─────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│               Component Event Handler                   │
└────────────────────┬───────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│            Call Service/Composable Method              │
└────────────────────┬───────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│               Make API Request (Axios)                  │
└────────────────────┬───────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│              Update Reactive State (Store)             │
└────────────────────┬───────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│         Vue Reactivity Triggers Re-render              │
└────────────────────┬───────────────────────────────────┘
                     ↓
┌────────────────────────────────────────────────────────┐
│               UI Updates Automatically                  │
└────────────────────────────────────────────────────────┘
```

## API Communication

### Axios Configuration

```javascript
// Base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // Enable cookies
})

// Request interceptor - Add auth token
api.interceptors.request.use(config => {
  const { store } = useAuth()
  if (store.token) {
    config.headers.Authorization = `Bearer ${store.token}`
  }
  return config
})

// Response interceptor - Handle errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Logout on unauthorized
      auth.logout()
    }
    return Promise.reject(error)
  }
)
```

### API Service Pattern

```javascript
// Quiz service example
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
  solve: (id, answers) => api.post(`/quizzes/${id}/solve`, { answers })
}
```

## Security Architecture

### Security Layers

1. **Cookie Security**
   - HTTP-only cookies for refresh tokens
   - Secure flag for HTTPS
   - SameSite=Strict for CSRF protection
   - Proper expiry times

2. **Route Protection**
   - Authentication guards
   - Permission-based access control
   - Redirect loop prevention
   - Session validation

3. **API Security**
   - Bearer token authentication
   - CORS configuration
   - Request validation
   - Error sanitization

4. **Client-Side Security**
   - XSS prevention (Vue's automatic escaping)
   - No sensitive data in localStorage
   - Secure token storage
   - Input validation

### Security Best Practices

- ✅ Never store sensitive data in localStorage
- ✅ Use HTTP-only cookies for tokens
- ✅ Validate all user input
- ✅ Sanitize error messages (no stack traces to user)
- ✅ Implement proper CORS
- ✅ Use HTTPS in production
- ✅ Regular security audits
- ✅ Keep dependencies updated

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**
   - Route-based lazy loading
   - Dynamic imports
   - Reduced initial bundle size

2. **Caching**
   - Browser caching for static assets
   - API response caching (where appropriate)
   - Service Worker (future enhancement)

3. **Bundle Optimization**
   - Tree shaking (Vite)
   - Minification
   - Compression (gzip/brotli)

4. **Rendering Performance**
   - Virtual scrolling for large lists
   - Debounced search inputs
   - Lazy loading images
   - Efficient reactivity patterns

5. **Network Optimization**
   - Request batching
   - Optimistic updates
   - Background data fetching
   - Proper error retry logic

### Performance Metrics

Target metrics for optimal user experience:

- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

## Future Architecture Improvements

### Planned Enhancements

1. **State Management**
   - Migrate to Pinia for better DevTools support
   - Implement state persistence strategy
   - Add undo/redo functionality

2. **Testing**
   - Unit tests with Vitest
   - Component tests with Vue Test Utils
   - E2E tests with Playwright/Cypress

3. **Performance**
   - Implement Progressive Web App (PWA)
   - Add Service Worker for offline support
   - Optimize bundle size further

4. **Architecture**
   - Implement micro-frontend architecture
   - Add GraphQL layer (optional)
   - Modularize by feature (vertical slicing)

5. **Developer Experience**
   - Add Storybook for component documentation
   - Implement automated code generation
   - Enhanced TypeScript support

## Conclusion

The Quizify App architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Secure**: Multiple layers of security
- **Performant**: Optimized for speed
- **Developer-friendly**: Clear patterns and structure

This architecture provides a solid foundation for current needs while remaining flexible for future growth.
