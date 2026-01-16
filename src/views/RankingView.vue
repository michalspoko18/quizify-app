<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">🏆 Ranking</h2>
      <RouterLink to="/home" class="btn btn-outline-secondary">
        ← Powrót
      </RouterLink>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center mb-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Ładowanie...</span>
      </div>
      <p class="mt-2">Ładowanie danych rankingu...</p>
    </div>

    <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center">
      <div>
        <strong>Błąd:</strong> {{ error }}
      </div>
      <div>
        <button class="btn btn-sm btn-outline-light" @click="loadRankings">Spróbuj ponownie</button>
      </div>
    </div>

    <!-- Globalny ranking -->
    <div class="card shadow mb-4">
      <div class="card-header bg-primary text-white">
        <h5 class="mb-0">Top 10 Graczy</h5>
      </div>
      <div class="card-body">
        <div
          v-if="globalRankings.length === 0"
          class="text-center text-muted py-4"
        >
          Brak wyników. Rozwiąż quiz aby pojawić się w rankingu!
        </div>
        <table v-else class="table table-hover">
          <thead>
            <tr>
              <th style="width: 60px">#</th>
              <th>Gracz</th>
              <th class="text-center">Quizów</th>
              <th class="text-center">Średni wynik</th>
              <th class="text-center">Suma punktów</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in globalRankings"
              :key="user.userId"
              :class="{ 'table-success': user.userId === store.sub }"
            >
              <td class="fw-bold">
                <span v-if="index === 0">🥇</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else>{{ index + 1 }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <span class="me-2">{{ user.userNick || user.userName }}</span>
                  <span
                    v-if="user.userId === store.sub"
                    class="badge bg-success"
                    >Ty</span
                  >
                </div>
              </td>
              <td class="text-center">{{ user.quizzesCompleted }}</td>
              <td class="text-center">
                <span class="badge" :class="getBadgeClass(user.averageScore)">
                  {{ user.averageScore }}%
                </span>
              </td>
              <td class="text-center">{{ user.totalScore }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Statystyki użytkownika -->
    <div v-if="store.isAuth" class="card shadow mb-4">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">Twoje Statystyki</h5>
      </div>
      <div class="card-body">
        <div
          v-if="userStats.totalQuizzes === 0"
          class="text-center text-muted py-4"
        >
          Nie rozwiązałeś jeszcze żadnego quizu!
        </div>
        <div v-else class="row g-3">
          <div class="col-md-3">
            <div
              class="stat-box text-center p-3 bg-primary bg-opacity-10 rounded"
            >
              <div class="h3 mb-1">{{ userStats.totalQuizzes }}</div>
              <div class="text-muted small">Rozwiązanych quizów</div>
            </div>
          </div>
          <div class="col-md-3">
            <div
              class="stat-box text-center p-3 bg-success bg-opacity-10 rounded"
            >
              <div class="h3 mb-1">{{ userStats.averageScore }}%</div>
              <div class="text-muted small">Średni wynik</div>
            </div>
          </div>
          <div class="col-md-3">
            <div
              class="stat-box text-center p-3 bg-warning bg-opacity-10 rounded"
            >
              <div class="h3 mb-1">{{ userStats.bestScore }}%</div>
              <div class="text-muted small">Najlepszy wynik</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-box text-center p-3 bg-info bg-opacity-10 rounded">
              <div class="h3 mb-1">
                {{ userStats.totalCorrect }}/{{ userStats.totalQuestions }}
              </div>
              <div class="text-muted small">Poprawne odpowiedzi</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Najpopularniejsze quizy -->
    <div class="card shadow">
      <div class="card-header bg-warning text-dark">
        <h5 class="mb-0">⭐ Najpopularniejsze Quizy</h5>
      </div>
      <div class="card-body">
        <div
          v-if="popularQuizzes.length === 0"
          class="text-center text-muted py-4"
        >
          Brak danych o quizach
        </div>
        <div v-else class="list-group list-group-flush">
          <div
            v-for="(quiz, index) in popularQuizzes"
            :key="quiz.quizId"
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            <div class="d-flex align-items-center">
              <span class="badge bg-warning text-dark me-3 fs-6">{{
                index + 1
              }}</span>
              <div>
                <h6 class="mb-1">{{ quiz.quizTitle }}</h6>
                <small class="text-muted">
                  Rozwiązany {{ quiz.timesCompleted }}x • Średni wynik:
                  {{ quiz.averageScore }}%
                </small>
              </div>
            </div>
            <RouterLink
              :to="`/quiz/${quiz.quizId}`"
              class="btn btn-sm btn-outline-primary"
            >
              Rozwiąż
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  getGlobalRankings,
  getUserStats,
  getMostPopularQuizzes,
  cleanInvalidRankings,
} from "../services/rankingService";
import { useAuth } from "../store/auth.js";

const { store } = useAuth();
const globalRankings = ref([]);
const popularQuizzes = ref([]);
const userStats = ref({
  totalQuizzes: 0,
  averageScore: 0,
  bestScore: 0,
  totalCorrect: 0,
  totalQuestions: 0,
});

const loading = ref(false);
const error = ref(null);

async function loadRankings() {
  loading.value = true;
  error.value = null;

  // Wyczyść nieprawidłowe wpisy przy pierwszym załadowaniu
  cleanInvalidRankings();

  try {
    const g = await getGlobalRankings(10);
    globalRankings.value = g;

    const p = await getMostPopularQuizzes(5);
    popularQuizzes.value = p;

    if (store.isAuth && store.sub) {
      userStats.value = await getUserStats(store.sub);
    } else {
      // attempt to fetch stats for anonymous/external id (service will fallback)
      const s = await getUserStats();
      userStats.value = s;
    }
  } catch (err) {
    console.warn("Error loading rankings", err);
    error.value = err?.message || String(err) || "Błąd podczas pobierania danych";
  } finally {
    loading.value = false;
  }
}

function getBadgeClass(score) {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-danger";
}

onMounted(loadRankings);
// Listen for external updates (e.g. after finishing a quiz)
function handleRankingUpdated() {
  loadRankings();
}

onMounted(() => {
  window.addEventListener("ranking:updated", handleRankingUpdated);
});

onUnmounted(() => {
  window.removeEventListener("ranking:updated", handleRankingUpdated);
});
</script>

<style scoped>
.stat-box {
  transition: transform 0.2s ease;
}

.stat-box:hover {
  transform: translateY(-3px);
}

.table-success {
  background-color: rgba(25, 135, 84, 0.1) !important;
}
</style>
