<template>
<div class="row justify-content-center py-5">
<div class="col-12 col-lg-8">
<div class="card border-0 shadow rounded-4">
<div class="card-body p-4 p-md-5">
<h1 class="h3 mb-3">Rejestracja</h1>

<p class="text-secondary">Utwórz nowe konto, aby korzystać z Quizify.</p>

<form @submit.prevent="handleSubmit" novalidate>
  <!-- Email -->
  <div class="mb-3">
    <label for="email" class="form-label">Email</label>
    <input
      id="email"
      v-model.trim="form.email"
      type="email"
      class="form-control"
      :class="{ 'is-invalid': errors.email, 'is-valid': form.email && !errors.email }"
      placeholder="twoj@email.com"
      required
      @blur="validateField('email')"
    />
    <div v-if="errors.email" class="invalid-feedback">
      {{ errors.email }}
    </div>
  </div>

  <!-- Hasło -->
  <div class="mb-3">
    <label for="password" class="form-label">Hasło</label>
    <input
      id="password"
      v-model="form.password"
      type="password"
      class="form-control"
      :class="{ 'is-invalid': errors.password, 'is-valid': form.password && !errors.password }"
      placeholder="Min. 8 znaków"
      required
      @blur="validateField('password')"
    />
    <div v-if="errors.password" class="invalid-feedback">
      {{ errors.password }}
    </div>
    <div class="form-text">
      Hasło musi mieć co najmniej 8 znaków i zawierać wielką literę, małą literę i cyfrę.
    </div>
  </div>

  <!-- Potwierdzenie hasła -->
  <div class="mb-3">
    <label for="confirmPassword" class="form-label">Potwierdź hasło</label>
    <input
      id="confirmPassword"
      v-model="form.confirmPassword"
      type="password"
      class="form-control"
      :class="{ 'is-invalid': errors.confirmPassword, 'is-valid': form.confirmPassword && !errors.confirmPassword }"
      placeholder="Powtórz hasło"
      required
      @blur="validateField('confirmPassword')"
    />
    <div v-if="errors.confirmPassword" class="invalid-feedback">
      {{ errors.confirmPassword }}
    </div>
  </div>

  <!-- Nick -->
  <div class="mb-3">
    <label for="nick" class="form-label">Nick</label>
    <input
      id="nick"
      v-model.trim="form.nick"
      type="text"
      class="form-control"
      :class="{ 'is-invalid': errors.nick, 'is-valid': form.nick && !errors.nick }"
      placeholder="np. NightHunter"
      minlength="3"
      maxlength="24"
      required
      @blur="validateField('nick')"
    />
    <div v-if="errors.nick" class="invalid-feedback">
      {{ errors.nick }}
    </div>
    <div class="form-text">
      3-24 znaki, tylko litery, cyfry, podkreślniki i myślniki.
    </div>
  </div>

  <!-- Zgoda na regulamin -->
  <div class="mb-3">
    <div class="form-check">
      <input
        id="terms"
        v-model="form.acceptTerms"
        type="checkbox"
        class="form-check-input"
        :class="{ 'is-invalid': errors.acceptTerms }"
        required
        @change="validateField('acceptTerms')"
      />
      <label for="terms" class="form-check-label">
        Akceptuję <a href="#" @click.prevent>regulamin</a> i <a href="#" @click.prevent>politykę prywatności</a>
      </label>
      <div v-if="errors.acceptTerms" class="invalid-feedback">
        {{ errors.acceptTerms }}
      </div>
    </div>
  </div>

  <!-- Przyciski -->
  <div class="d-flex gap-2 mb-3">
    <button
      type="submit"
      class="btn btn-primary"
      :disabled="!isFormValid || loading"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
      {{ loading ? 'Rejestrowanie...' : 'Zarejestruj się' }}
    </button>
    <RouterLink to="/login" class="btn btn-outline-secondary">
      Masz już konto? Zaloguj się
    </RouterLink>
  </div>
</form>

</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useErrors } from '../store/errors.js'
import { useAuth } from '../store/auth.js'
import { authAPI } from '../services/api.js'

const router = useRouter()
const errorStore = useErrors()
const { setSession } = useAuth()

// Stan formularza
const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  nick: '',
  acceptTerms: false
})

const errors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  nick: '',
  acceptTerms: ''
})

const loading = ref(false)

// Walidacja pól
const validators = {
  email: (value) => {
    if (!value) return 'Email jest wymagany'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Wprowadź poprawny adres email'
    return ''
  },
  
  password: (value) => {
    if (!value) return 'Hasło jest wymagane'
    if (value.length < 8) return 'Hasło musi mieć co najmniej 8 znaków'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Hasło musi zawierać wielką literę, małą literę i cyfrę'
    }
    return ''
  },
  
  confirmPassword: (value) => {
    if (!value) return 'Potwierdź hasło'
    if (value !== form.password) return 'Hasła nie są identyczne'
    return ''
  },
  
  nick: (value) => {
    if (!value) return 'Nick jest wymagany'
    if (value.length < 3) return 'Nick musi mieć co najmniej 3 znaki'
    if (value.length > 24) return 'Nick może mieć maksymalnie 24 znaki'
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Nick może zawierać tylko litery, cyfry, podkreślniki i myślniki'
    }
    return ''
  },
  
  acceptTerms: (value) => {
    if (!value) return 'Musisz zaakceptować regulamin'
    return ''
  }
}

function validateField(field) {
  errors[field] = validators[field](form[field])
}

function validateAllFields() {
  Object.keys(validators).forEach(field => {
    validateField(field)
  })
  return !Object.values(errors).some(error => error !== '')
}

const isFormValid = computed(() => {
  return Object.keys(validators).every(field => {
    return form[field] && !validators[field](form[field])
  })
})

async function handleSubmit() {
  if (!validateAllFields()) {
    errorStore.showError('Popraw błędy w formularzu')
    return
  }

  loading.value = true
  
  try {
    const { confirmPassword, acceptTerms, ...registerData } = form
    
    // Przykładowe wywołanie API (dostosuj do swojego backendu)
    const response = await authAPI.register(registerData)
    setSession(response.data)
    
    errorStore.showSuccess('Konto zostało utworzone! Zalogowano automatycznie.')
    
    setTimeout(() => {
      router.push('/home')
    }, 1000)
    
  } catch (error) {
    errorStore.showError(error.message || 'Błąd podczas rejestracji')
  } finally {
    loading.value = false
  }
}
</script>
