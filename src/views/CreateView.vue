<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📝 Utwórz Quiz</h2>
      <RouterLink to="/home" class="btn btn-outline-secondary">
        ← Powrót
      </RouterLink>
    </div>

    <div class="card shadow">
      <div class="card-body p-4">
        <form @submit.prevent="saveQuiz">
          <!-- Informacje podstawowe -->
          <div class="mb-4">
            <h5 class="border-bottom pb-2">Informacje podstawowe</h5>

            <div class="mb-3">
              <label for="quizTitle" class="form-label">Tytuł quizu *</label>
              <input
                id="quizTitle"
                v-model="quiz.title"
                type="text"
                class="form-control"
                placeholder="np. Quiz z JavaScript"
                required
              />
            </div>

            <div class="mb-3">
              <label for="quizDescription" class="form-label">Opis</label>
              <textarea
                id="quizDescription"
                v-model="quiz.description"
                class="form-control"
                rows="2"
                placeholder="Krótki opis quizu"
              ></textarea>
            </div>
          </div>

          <!-- Pytania -->
          <div class="mb-4">
            <div
              class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3"
            >
              <h5 class="mb-0">Pytania</h5>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                @click="addQuestion"
              >
                + Dodaj pytanie
              </button>
            </div>

            <div v-if="quiz.questions.length === 0" class="alert alert-info">
              Dodaj przynajmniej jedno pytanie do quizu
            </div>

            <!-- Lista pytań -->
            <div
              v-for="(question, qIndex) in quiz.questions"
              :key="qIndex"
              class="card mb-3"
            >
              <div class="card-header bg-light">
                <div class="d-flex justify-content-between align-items-center">
                  <strong>Pytanie {{ qIndex + 1 }}</strong>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger"
                    @click="removeQuestion(qIndex)"
                  >
                    Usuń
                  </button>
                </div>
              </div>
              <div class="card-body">
                <!-- Treść pytania -->
                <div class="mb-3">
                  <label class="form-label">Treść pytania *</label>
                  <input
                    v-model="question.question"
                    type="text"
                    class="form-control"
                    placeholder="Wpisz pytanie"
                    required
                  />
                </div>

                <!-- Odpowiedzi -->
                <div class="mb-2">
                  <label class="form-label">Odpowiedzi</label>
                  <div
                    v-for="(answer, aIndex) in question.answers"
                    :key="aIndex"
                    class="input-group mb-2"
                  >
                    <span class="input-group-text">
                      <input
                        type="radio"
                        :name="'correct-' + qIndex"
                        :checked="answer.isCorrect"
                        @change="setCorrectAnswer(qIndex, aIndex)"
                        class="form-check-input mt-0"
                        title="Zaznacz jako poprawną odpowiedź"
                      />
                    </span>
                    <input
                      v-model="answer.text"
                      type="text"
                      class="form-control"
                      placeholder="Odpowiedź"
                      required
                    />
                    <button
                      v-if="question.answers.length > 2"
                      type="button"
                      class="btn btn-outline-danger"
                      @click="removeAnswer(qIndex, aIndex)"
                    >
                      ×
                    </button>
                  </div>
                  <button
                    v-if="question.answers.length < 6"
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="addAnswer(qIndex)"
                  >
                    + Dodaj odpowiedź
                  </button>
                  <small class="text-muted d-block mt-2">
                    💡 Zaznacz radio button przy poprawnej odpowiedzi
                  </small>
                </div>
              </div>
            </div>
          </div>

          <!-- Przyciski -->
          <div v-if="saveError" class="alert alert-danger mb-3">
            {{ saveError }}
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="resetForm"
              :disabled="isSaving"
            >
              Wyczyść
            </button>
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!isValid || isSaving"
            >
              <span
                v-if="isSaving"
                class="spinner-border spinner-border-sm me-1"
              ></span>
              {{ isSaving ? "Zapisywanie..." : "Zapisz quiz" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal potwierdzenia -->
    <div
      v-if="showSuccess"
      class="modal show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">✓ Sukces!</h5>
          </div>
          <div class="modal-body">
            <p class="mb-0">Quiz został zapisany pomyślnie!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeSuccess">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { quizAPI } from "../services/api.js";

const router = useRouter();
const showSuccess = ref(false);
const isSaving = ref(false);
const saveError = ref("");

const quiz = ref({
  title: "",
  description: "",
  questions: [],
});

// Dodaj nowe pytanie
function addQuestion() {
  quiz.value.questions.push({
    id: Date.now(),
    question: "",
    answers: [
      { id: 1, text: "", isCorrect: true },
      { id: 2, text: "", isCorrect: false },
    ],
  });
}

// Usuń pytanie
function removeQuestion(index) {
  quiz.value.questions.splice(index, 1);
}

// Dodaj odpowiedź do pytania
function addAnswer(questionIndex) {
  const question = quiz.value.questions[questionIndex];
  const newId = Math.max(...question.answers.map((a) => a.id), 0) + 1;
  question.answers.push({
    id: newId,
    text: "",
    isCorrect: false,
  });
}

// Usuń odpowiedź
function removeAnswer(questionIndex, answerIndex) {
  const question = quiz.value.questions[questionIndex];
  const wasCorrect = question.answers[answerIndex].isCorrect;
  question.answers.splice(answerIndex, 1);

  // Jeśli usunęliśmy poprawną odpowiedź, ustaw pierwszą jako poprawną
  if (wasCorrect && question.answers.length > 0) {
    question.answers[0].isCorrect = true;
  }
}

// Ustaw poprawną odpowiedź
function setCorrectAnswer(questionIndex, answerIndex) {
  const question = quiz.value.questions[questionIndex];
  question.answers.forEach((answer, index) => {
    answer.isCorrect = index === answerIndex;
  });
}

// Walidacja
const isValid = computed(() => {
  if (!quiz.value.title.trim()) return false;
  if (quiz.value.questions.length === 0) return false;

  return quiz.value.questions.every((q) => {
    if (!q.question.trim()) return false;
    if (q.answers.length < 2) return false;
    if (!q.answers.every((a) => a.text.trim())) return false;
    if (!q.answers.some((a) => a.isCorrect)) return false;
    return true;
  });
});

// Zapisz quiz
async function saveQuiz() {
  if (!isValid.value) return;

  isSaving.value = true;
  saveError.value = "";

  try {
    // Przygotuj dane w formacie oczekiwanym przez backend
    const payload = {
      title: quiz.value.title,
      description: quiz.value.description || "",
      questions: quiz.value.questions.map((q) => ({
        text: q.question,
        answers: q.answers.map((a) => ({
          text: a.text,
          is_correct: a.isCorrect,
        })),
      })),
    };
    await quizAPI.createQuiz(payload);
    showSuccess.value = true;
  } catch (error) {
    saveError.value = error.message || "Nie udało się zapisać quizu";
    console.error("Błąd zapisywania quizu:", error);
  } finally {
    isSaving.value = false;
  }
}

// Wyczyść formularz
function resetForm() {
  quiz.value = {
    title: "",
    description: "",
    questions: [],
  };
}

// Zamknij modal sukcesu
function closeSuccess() {
  showSuccess.value = false;
  resetForm();
  router.push("/home");
}
</script>

<style scoped>
.card {
  border: 1px solid var(--bs-border-color);
}

.input-group-text input[type="radio"] {
  cursor: pointer;
}

.modal.show {
  display: block;
}
</style>
