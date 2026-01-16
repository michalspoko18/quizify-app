<template>
  <div class="row justify-content-center py-5">
    <div class="col-12 col-lg-8">
      <div class="card border-0 shadow rounded-4">
        <div class="card-body p-4 p-md-5">
          <h1 class="h3 mb-3">Logowanie</h1>

          <div v-if="!store.isAuth" class="alert alert-info">
            Niezalogowany.
          </div>
          <div v-else class="alert alert-success">
            Zalogowano jako <strong>{{ store.name || store.username }}</strong
            >.
            <template v-if="store.nick">
              Nick: <span class="badge text-bg-warning">{{ store.nick }}</span
              >.</template
            >
          </div>

          <!-- Formularz logowania email/hasło -->
          <div v-if="!store.isAuth" class="mb-4">
            <form @submit.prevent="handleEmailLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model.trim="loginForm.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': loginErrors.email }"
                  placeholder="twoj@email.com"
                  required
                  @blur="validateLoginField('email')"
                />
                <div v-if="loginErrors.email" class="invalid-feedback">
                  {{ loginErrors.email }}
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Hasło</label>
                <input
                  id="password"
                  v-model="loginForm.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': loginErrors.password }"
                  placeholder="Twoje hasło"
                  required
                  @blur="validateLoginField('password')"
                />
                <div v-if="loginErrors.password" class="invalid-feedback">
                  {{ loginErrors.password }}
                </div>
              </div>

              <div class="d-flex gap-2 mb-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="!isLoginFormValid || loginLoading"
                >
                  <span
                    v-if="loginLoading"
                    class="spinner-border spinner-border-sm me-2"
                    aria-hidden="true"
                  ></span>
                  {{ loginLoading ? "Logowanie..." : "Zaloguj się" }}
                </button>
                <RouterLink to="/register" class="btn btn-outline-secondary">
                  Nie masz konta? Zarejestruj się
                </RouterLink>
              </div>
            </form>

            <div class="text-center my-3">
              <span class="text-muted">lub</span>
            </div>
          </div>

          <!-- Logowanie przez Google -->
          <div v-if="!store.isAuth" class="mb-4">
            <p class="text-secondary">
              Zaloguj się kontem Google. Po pierwszym logowaniu ustaw swój
              <span class="badge text-bg-warning">nick</span>.
            </p>
            <div class="d-flex gap-2">
              <button
                class="btn btn-outline-primary"
                @click="handleGoogleLogin"
                :disabled="googleLoading"
              >
                <span
                  v-if="googleLoading"
                  class="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
                {{ googleLoading ? "Logowanie..." : "Zaloguj przez Google" }}
              </button>
              <button
                v-if="googleLoading"
                class="btn btn-outline-secondary btn-sm"
                @click="cancelGoogleLogin"
                title="Anuluj logowanie"
              >
                Anuluj
              </button>
            </div>
          </div>

          <!-- Przyciski nawigacji (widoczne po zalogowaniu) -->
          <div v-if="store.isAuth" class="d-flex gap-2">
            <RouterLink class="btn btn-success" to="/home"
              >Strona główna</RouterLink
            >
            <RouterLink class="btn btn-outline-success" to="/create"
              >Utwórz zestaw</RouterLink
            >
            <RouterLink class="btn btn-outline-info" to="/ranking"
              >Ranking</RouterLink
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../store/auth.js";
import { useErrors } from "../store/errors.js";
import { authAPI } from "../services/api.js";

const router = useRouter();
const route = useRoute();
const { store, login, logout, ensureSession } = useAuth();
const errorStore = useErrors();

// Obserwuj stan zalogowania i przekieruj jeśli już zalogowany
watch(
  () => store.isAuth,
  (isAuth) => {
    if (isAuth) {
      const redirectTo = route.query.redirect || "/home";
      router.push(redirectTo);
    }
  },
  { immediate: true }
);

// Stan formularza logowania email/hasło
const loginForm = reactive({
  email: "",
  password: "",
});

const loginErrors = reactive({
  email: "",
  password: "",
});

const loginLoading = ref(false);
const googleLoading = ref(false);

// Walidacja logowania
const loginValidators = {
  email: (value) => {
    if (!value) return "Email jest wymagany";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Wprowadź poprawny adres email";
    return "";
  },

  password: (value) => {
    if (!value) return "Hasło jest wymagane";
    return "";
  },
};

function validateLoginField(field) {
  loginErrors[field] = loginValidators[field](loginForm[field]);
}

function validateLoginForm() {
  Object.keys(loginValidators).forEach((field) => {
    validateLoginField(field);
  });
  return !Object.values(loginErrors).some((error) => error !== "");
}

const isLoginFormValid = computed(() => {
  return Object.keys(loginValidators).every((field) => {
    return loginForm[field] && !loginValidators[field](loginForm[field]);
  });
});

async function handleEmailLogin() {
  if (!validateLoginForm()) {
    errorStore.showError("Popraw błędy w formularzu");
    return;
  }

  loginLoading.value = true;

  try {
    // Przykładowe wywołanie API (dostosuj do swojego backendu)
    await authAPI.login(loginForm);

    // Ensure auth store picks up backend session via /api/me
    await ensureSession();

    errorStore.showSuccess("Zalogowano pomyślnie!");
    const redirectTo = route.query.redirect || "/home";
    router.push(redirectTo);
  } catch (error) {
    errorStore.showError(error.message || "Błąd podczas logowania");
  } finally {
    loginLoading.value = false;
  }
}

let loginAbortController = null;

async function handleGoogleLogin() {
  googleLoading.value = true;

  // Utwórz AbortController dla możliwości anulowania
  loginAbortController = new AbortController();

  try {
    await login();
    // Po stronie backendu utrwalamy użytkownika Google (sub, email, name, picture, nick)
    if (store?.account?.sub && store?.account?.email) {
      await authAPI.loginWithGoogle({
        sub: store.account.sub,
        email: store.account.email,
        name: store.account.name,
        picture: store.account.picture,
        nick: store.nick,
      });
    }
    errorStore.showSuccess("Zalogowano pomyślnie przez Google!");
    router.push("/home");
  } catch (error) {
    // Nie pokazuj błędu jeśli użytkownik anulował
    if (
      !error.message.includes("anulowane") &&
      !error.message.includes("przerwane")
    ) {
      errorStore.showError(
        error.message || "Błąd podczas logowania przez Google"
      );
    }
  } finally {
    googleLoading.value = false;
    loginAbortController = null;
  }
}

function cancelGoogleLogin() {
  if (loginAbortController) {
    loginAbortController.abort();
    googleLoading.value = false;
    loginAbortController = null;
  }
}
</script>
