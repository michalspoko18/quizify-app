<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>📚 Lista Quizów</h2>
      <button class="btn btn-outline-secondary" @click="goBack">
        ← Powrót
      </button>
    </div>

    <!-- Quizy z backendu -->
    <div class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="mb-0">Quizy dostępne</h4>
        <div class="btn-group">
          <button
            class="btn btn-outline-primary btn-sm"
            @click="previousPage"
            :disabled="currentPage === 0"
          >
            ← Poprzednie
          </button>
          <button
            class="btn btn-outline-primary btn-sm"
            @click="nextPage"
            :disabled="currentPage >= totalPages - 1"
          >
            Następne →
          </button>
        </div>
      </div>

      <div class="row g-3">
        <div
          v-for="quiz in paginatedQuizzes"
          :key="'mock-' + quiz.id"
          class="col-md-4"
        >
          <div class="card h-100 shadow-sm hover-card">
            <div class="card-body">
              <h5 class="card-title">{{ quiz.title }}</h5>
              <p class="card-text text-muted small">{{ quiz.description }}</p>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <small class="text-muted">
                  {{ (quiz.questions && quiz.questions.length) || 0 }} pytań
                </small>
                <RouterLink
                  :to="'/quiz/' + quiz.id"
                  class="btn btn-primary btn-sm"
                >
                  Rozpocznij →
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wskaźnik strony / stany -->
      <div class="text-center mt-3">
        <small v-if="loading" class="text-muted">Ładowanie quizów...</small>
        <small v-else-if="error" class="text-danger">{{ error }}</small>
        <small v-else class="text-muted">
          Strona {{ currentPage + 1 }} z {{ totalPages }} ({{ quizzes.length }}
          quizów)
        </small>
      </div>
    </div>

    <!-- Własne quizy (z backendu) -->
    <div class="mt-4">
      <h4 class="mb-3">Twoje quizy</h4>

      <div v-if="loadingMine" class="text-muted">
        Ładowanie Twoich quizów...
      </div>
      <div v-else-if="errorMine" class="alert alert-warning">
        {{ errorMine }}
      </div>

      <div v-else-if="customQuizzes.length > 0" class="row g-3">
        <div
          v-for="quiz in customQuizzes"
          :key="'custom-' + quiz.id"
          class="col-md-6"
        >
          <div class="card h-100 shadow-sm hover-card border-success">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <h5 class="card-title mb-0">{{ quiz.title }}</h5>
                <span class="badge bg-success">Własny</span>
              </div>
              <p class="card-text text-muted">
                {{ quiz.description || "Brak opisu" }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  {{
                    quiz.questionsCount ??
                    ((quiz.questions && quiz.questions.length) || 0)
                  }}
                  pytań
                </small>
                <div class="btn-group">
                  <RouterLink
                    :to="'/quiz/' + quiz.id"
                    class="btn btn-primary btn-sm"
                  >
                    Rozpocznij →
                  </RouterLink>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="deleteQuiz(quiz.id)"
                    title="Usuń quiz"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="alert alert-info">
        <strong>Brak własnych quizów.</strong> Utwórz swój pierwszy quiz
        klikając <RouterLink to="/create">tutaj</RouterLink>.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { quizAPI } from "../services/api.js";
import { useAuth } from "../store/auth.js";
import { authCookies } from "../utils/cookies.js";

const router = useRouter();
const { store: authStore } = useAuth();
const customQuizzes = ref([]);
const quizzes = ref([]);
const loading = ref(false);
const error = ref(null);
const loadingMine = ref(false);
const errorMine = ref(null);
const currentPage = ref(0);
const quizzesPerPage = 3;

// Oblicz całkowitą liczbę stron
const totalPages = computed(() =>
  Math.ceil(quizzes.value.length / quizzesPerPage)
);

// Pobierz quizy dla aktualnej strony
const paginatedQuizzes = computed(() => {
  const start = currentPage.value * quizzesPerPage;
  const end = start + quizzesPerPage;
  return quizzes.value.slice(start, end);
});

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
}

async function loadQuizzes() {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await quizAPI.getQuizzes();
    quizzes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    error.value = e.message || "Nie udało się pobrać listy quizów";
  } finally {
    loading.value = false;
  }
}

async function loadMyQuizzes() {
  loadingMine.value = true;
  errorMine.value = null;
  try {
    const params = {};
    // Prefer local user id if available
    if (authStore.sub) params.ownerId = authStore.sub;
    // Also send google sub if we have it in cookie user data
    try {
      const ud = authCookies.getUserData();
      if (ud && ud.sub) params.ownerGoogleId = ud.sub;
    } catch (e) {
      // ignore
    }

    const { data } = await quizAPI.getMyQuizzes(params);
    customQuizzes.value = Array.isArray(data) ? data : [];
  } catch (e) {
    // If not authenticated/expired session, keep empty list and show message
    customQuizzes.value = [];
    errorMine.value = e.message || "Nie udało się pobrać Twoich quizów";
  } finally {
    loadingMine.value = false;
  }
}

async function deleteQuiz(quizId) {
  if (!confirm("Czy na pewno chcesz usunąć ten quiz?")) return;
  try {
    await quizAPI.deleteQuiz(quizId);
    await loadMyQuizzes();
  } catch (e) {
    alert(e.message || "Nie udało się usunąć quizu");
  }
}

function goBack() {
  router.push("/home");
}

onMounted(() => {
  loadMyQuizzes();
  loadQuizzes();
});
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
}

.card {
  border: 1px solid var(--bs-border-color);
}
</style>
