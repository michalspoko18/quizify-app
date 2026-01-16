// Service do zarządzania rankingiem i wynikami quizów

// Struktura wyniku:
// {
//   id: unique_id,
//   userId: user_sub,
//   userName: user_name,
//   userNick: user_nick,
//   quizId: quiz_id,
//   quizTitle: quiz_title,
//   score: percentage,
//   correctAnswers: number,
//   totalQuestions: number,
//   timestamp: date,
//   passed: boolean
// }

const STORAGE_KEY = "quizify_rankings";

// Pobierz wszystkie wyniki z localStorage
export function getRankings() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Wyczyść nieprawidłowe wpisy (bez userId)
export function cleanInvalidRankings() {
  const rankings = getRankings();
  const validRankings = rankings.filter(
    (score) => score.userId && score.userId !== "undefined"
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(validRankings));
  return validRankings.length !== rankings.length;
}

// Zapisz wynik do rankingu
import { rankingAPI } from "./api.js";
import { useAuth } from "../store/auth.js";
import { authCookies } from "../utils/cookies.js";

export async function saveScore(scoreData) {
  const rankings = getRankings();

  // Jeśli nie podano userId spróbuj pobrać je automatycznie z sesji
  if (!scoreData.userId || scoreData.userId === "undefined") {
    try {
      const { store } = useAuth();
      const cookieUser = authCookies.getUserData();
      scoreData.userId =
        store?.sub || cookieUser?.sub || scoreData.userId || null;
    } catch (e) {
      scoreData.userId = scoreData.userId || null;
    }
  }

  // If still no userId, ensure we have a per-browser anon id so backend can group
  if (!scoreData.userId) {
    scoreData.userId = getOrCreateAnonId();
  }

  const newScore = {
    id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...scoreData,
    timestamp: new Date().toISOString(),
  };

  // Zapis lokalny jako fallback
  rankings.push(newScore);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));

  // Jeśli użytkownik jest zalogowany spróbuj wysłać wynik do backendu
  try {
    const { store } = useAuth();
    if (store.isAuth) {
      // Backend oczekuje: quizId, percentage, correctAnswers, totalQuestions, passed
      const payload = {
        quizId: newScore.quizId,
        percentage: newScore.score || newScore.percentage || 0,
        correctAnswers: newScore.correctAnswers,
        totalQuestions: newScore.totalQuestions,
        passed: newScore.passed,
      };

      // Await backend submission so callers can react to up-to-date data.
      try {
        await rankingAPI.submitScore(payload);
      } catch (err) {
        console.warn(
          "Nie udało się wysłać wyniku do backendu, zapisano lokalnie",
          err
        );
      }
    }
  } catch (err) {
    console.warn("Błąd podczas próby wysyłki wyniku do backendu", err);
  }

  return newScore;
}

// Return or create a per-browser anonymous id stored in localStorage
export function getOrCreateAnonId() {
  const KEY = "quizify_anon_user";
  let id = localStorage.getItem(KEY);
  if (id && id !== "undefined") return id;
  id = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  localStorage.setItem(KEY, id);
  return id;
}

// Pobierz ranking dla konkretnego quizu
export function getQuizRankings(quizId) {
  const rankings = getRankings();
  return rankings
    .filter((r) => r.quizId === quizId)
    .sort(
      (a, b) =>
        b.score - a.score || new Date(b.timestamp) - new Date(a.timestamp)
    );
}

// Pobierz najlepsze wyniki użytkownika
export function getUserBestScores(userId) {
  const rankings = getRankings();
  const userScores = rankings.filter((r) => r.userId === userId);

  // Grupuj po quizId i weź najlepszy wynik dla każdego quizu
  const bestScores = {};
  userScores.forEach((score) => {
    if (
      !bestScores[score.quizId] ||
      bestScores[score.quizId].score < score.score
    ) {
      bestScores[score.quizId] = score;
    }
  });

  return Object.values(bestScores).sort((a, b) => b.score - a.score);
}

// Pobierz globalny ranking (top wyniki)
export function getGlobalRankings(limit = 10) {
  // Prefer backend; fallback to localStorage
  return rankingAPI
    .getRanking({ type: "global", limit })
    .then((res) => {
      const data = res.data || [];
      return data.map((u) => ({
        userId: u.userId,
        userName: u.userName,
        userNick: u.userNick,
        quizzesCompleted: u.quizzesCompleted,
        averageScore: u.averageScore,
        totalScore: u.totalScore,
      }));
    })
    .catch(() => {
      // Local fallback
      const rankings = getRankings();

      const userScores = {};
      rankings.forEach((score) => {
        if (!userScores[score.userId]) {
          userScores[score.userId] = {
            userId: score.userId,
            userName: score.userName,
            userNick: score.userNick,
            totalScore: 0,
            quizzesCompleted: 0,
            averageScore: 0,
          };
        }
        userScores[score.userId].totalScore += score.score;
        userScores[score.userId].quizzesCompleted++;
      });

      const rankings_array = Object.values(userScores).map((user) => ({
        ...user,
        averageScore: Math.round(user.totalScore / user.quizzesCompleted),
      }));

      return rankings_array
        .sort(
          (a, b) =>
            b.averageScore - a.averageScore || b.totalScore - a.totalScore
        )
        .slice(0, limit);
    });
}

// Pobierz statystyki użytkownika
export function getUserStats(userId) {
  // Prefer backend
  const { store } = useAuth();
  const effectiveUser =
    userId || store?.sub || authCookies.getUserData()?.sub || null;
  return rankingAPI
    .getRanking({ type: "me", userId: effectiveUser })
    .then((res) => res.data)
    .catch(() => {
      // local fallback
      const rankings = getRankings();
      const userScores = rankings.filter((r) => r.userId === userId);

      if (userScores.length === 0) {
        return {
          totalQuizzes: 0,
          averageScore: 0,
          bestScore: 0,
          totalCorrect: 0,
          totalQuestions: 0,
        };
      }

      const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
      const totalCorrect = userScores.reduce(
        (sum, s) => sum + s.correctAnswers,
        0
      );
      const totalQuestions = userScores.reduce(
        (sum, s) => sum + s.totalQuestions,
        0
      );
      const bestScore = Math.max(...userScores.map((s) => s.score));

      return {
        totalQuizzes: userScores.length,
        averageScore: Math.round(totalScore / userScores.length),
        bestScore,
        totalCorrect,
        totalQuestions,
      };
    });
}

// Pobierz najpopularniejsze quizy (najczęściej wybierane)
export function getMostPopularQuizzes(limit = 5) {
  return rankingAPI
    .getRanking({ type: "popular", limit })
    .then((res) => res.data)
    .catch(() => {
      const rankings = getRankings();

      const quizStats = {};
      rankings.forEach((score) => {
        if (!quizStats[score.quizId]) {
          quizStats[score.quizId] = {
            quizId: score.quizId,
            quizTitle: score.quizTitle,
            timesCompleted: 0,
            averageScore: 0,
            totalScore: 0,
          };
        }
        quizStats[score.quizId].timesCompleted++;
        quizStats[score.quizId].totalScore += score.score;
      });

      return Object.values(quizStats)
        .map((quiz) => ({
          ...quiz,
          averageScore: Math.round(quiz.totalScore / quiz.timesCompleted),
        }))
        .sort((a, b) => b.timesCompleted - a.timesCompleted)
        .slice(0, limit);
    });
}
