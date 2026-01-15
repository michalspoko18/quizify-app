# Quizify – Dokumentacja Projektowa

---

## Spis treści
1. Wstęp i Cele
   - Opis projektu
   - Karta projektu
   - Cele i metryki sukcesu
2. Analiza i Wymagania
   - Persony użytkowników
   - Historyjki użytkownika (User Stories)
   - Specyfikacja wymagań
3. Zarządzanie Projektem
   - Harmonogram i Kamienie Milowe
   - Plan komunikacji
   - Zarządzanie ryzykiem i zmianami
4. Szczegóły techniczne
   - Architektura systemu
   - Opis interfejsu
   - Plan wydań (Releases)
5. Struktura katalogów
6. Komponenty i widoki
7. Serwisy i komunikacja z backendem
8. Zarządzanie stanem (Store)
9. Routing i ochrona tras
10. Obsługa sesji i autoryzacji
11. Moduł quizów
12. Ranking i statystyki
13. Panel administracyjny
14. Obsługa błędów i powiadomień
15. Przykładowe przepływy użytkownika
16. Endpointy API
17. Testowanie i debugowanie
18. Rozwój projektu i onboarding
19. Bezpieczeństwo i Ochrona Danych
20. Lista zależności i ich wersji

---

## 1. Wstęp i Cele
### Opis projektu
Quizify to nowoczesna aplikacja webowa do tworzenia, rozwiązywania i zarządzania quizami. Projekt powstał, by umożliwić szybkie tworzenie quizów edukacyjnych, rywalizację oraz śledzenie postępów użytkowników. System wspiera autoryzację, ranking, panel administracyjny oraz rozbudowane zarządzanie sesją.

### Karta projektu
- **Nazwa:** Quizify
- **Typ:** Aplikacja webowa (SPA)
- **Technologie:** Vue 3, Vite, Vue Router, Bootstrap, własny store, REST API
- **Zespół:** 4 osoby (frontend, backend, QA, dokumentacja) 
Michał Walczak - PM, backend
Kacper Janiszewski - frontend, dokumentacja
Andrzej Jur - QA
Mateusz Pleń - frontend, dokumentacja
- **Repozytorium:** github.com/michalspoko18/quizify-app

### Cele i metryki sukcesu
- Umożliwienie tworzenia i rozwiązywania quizów przez użytkowników
- Wprowadzenie systemu rankingowego i statystyk
- Intuicyjny interfejs i szybkie działanie
- Minimum 100 aktywnych użytkowników miesięcznie
- Średni czas rozwiązania quizu < 5 minut
- Poziom satysfakcji użytkowników > 80% (ankieta)

---

## 2. Analiza i Wymagania
### Persony użytkowników
- **Student:** Szuka quizów do nauki, chce śledzić postępy
- **Nauczyciel:** Tworzy quizy dla grupy, analizuje wyniki
- **Administrator:** Zarządza quizami, użytkownikami, dba o bezpieczeństwo

### Historyjki użytkownika (User Stories)
- Jako student chcę rozwiązywać quizy, by sprawdzić swoją wiedzę
- Jako nauczyciel chcę tworzyć quizy i analizować wyniki moich uczniów
- Jako administrator chcę mieć kontrolę nad quizami i użytkownikami

### Specyfikacja wymagań
- Rejestracja i logowanie (własne + Google OAuth)
- Tworzenie, edycja, usuwanie quizów
- Rozwiązywanie quizów, prezentacja wyników
- Ranking globalny i indywidualny
- Panel administracyjny
- Obsługa błędów, powiadomienia
- Responsywny interfejs

---

## 4. Szczegóły techniczne
### Architektura systemu
Aplikacja modularna, SPA, podział na warstwy prezentacji, logiki, komunikacji z backendem, zarządzania stanem. Vue 3 + Vite, REST API, mockApi.js do testów.

### Opis interfejsu
- Prosty, responsywny layout (Bootstrap)
- Widoki: logowanie, rejestracja, lista quizów, rozwiązywanie quizu, ranking
- Komponenty: NavBar, NickPanel, ErrorNotifications, SessionDebug
- Makiety dostępne w docs/frontend.md

### Plan wydań (Releases)
- **v0.1** – Prototyp interfejsu, mockowe quizy
- **v0.5** – Autoryzacja, rejestracja, podstawowe quizy
- **v1.0** – Ranking, panel admina, testy
- **v1.1+** – Poprawki UX, nowe typy quizów, integracje

---

## 5. Struktura katalogów
- **src/** – główny katalog źródłowy
  - **components/** – komponenty UI (NavBar, NickPanel, ErrorNotifications, SessionDebug)
  - **views/** – widoki stron (HomeView, QuizView, QuizListView, CreateView, RankingView, AdminView, LoginView, RegisterView)
  - **router/** – konfiguracja tras (index.js), guardy (guards.js)
  - **store/** – zarządzanie stanem (auth.js, errors.js)
  - **services/** – komunikacja z backendem (api.js, mockApi.js, rankingService.js)
  - **composables/** – logika kompozycyjna (useSession.js)
  - **utils/** – narzędzia pomocnicze (cookies.js)

---

## 6. Komponenty i widoki
### Komponenty
- **NavBar.vue** – pasek nawigacji, obsługa logowania/wylogowania, wyświetlanie nicku
- **NickPanel.vue** – panel zmiany nicku użytkownika
- **ErrorNotifications.vue** – globalne powiadomienia o błędach
- **SessionDebug.vue** – panel debugowania sesji (dev)

### Widoki
- **HomeView.vue** – strona główna, powitanie, statystyki użytkownika
- **QuizListView.vue** – lista dostępnych quizów, paginacja, wybór quizu
- **QuizView.vue** – rozwiązywanie quizu, obsługa pytań i odpowiedzi, prezentacja wyniku
- **CreateView.vue** – tworzenie nowego quizu, dynamiczne dodawanie pytań i odpowiedzi
- **RankingView.vue** – ranking globalny, statystyki, najpopularniejsze quizy
- **AdminView.vue** – panel administracyjny (zarządzanie quizami, użytkownikami)
- **LoginView.vue / RegisterView.vue** – autoryzacja i rejestracja

---

## 7. Serwisy i komunikacja z backendem
### Pliki serwisów
- **api.js** – obsługa zapytań HTTP do backendu (quizy, ranking, autoryzacja)
- **mockApi.js** – mockowe API do testów i developmentu (quizy, odpowiedzi, wyniki)
- **rankingService.js** – logika rankingowa, statystyki, zapisywanie wyników

Przykład komunikacji:
```js
// Pobranie quizu
quizAPI.getQuiz(id)
// Przesłanie odpowiedzi
quizAPI.answerQuiz(id, data)
// Pobranie rankingu
rankingAPI.getRanking({ type: "global" })
```

---

## 8. Zarządzanie stanem (Store)
- **auth.js** – stan autoryzacji, sesji, obsługa logowania, wylogowania, Google OAuth
- **errors.js** – globalna obsługa błędów, powiadomienia

Store jest wykorzystywany przez komponenty i widoki do synchronizacji stanu użytkownika, sesji, nicku, tokenów oraz błędów.

---

## 9. Routing i ochrona tras
- **index.js** – definicje tras (ścieżki, widoki, meta, uprawnienia)
- **guards.js** – funkcje guardów (authGuard, guestGuard, logRouteAccess)

Przykład trasy chronionej:
```js
{
  path: '/ranking',
  name: 'ranking',
  component: RankingView,
  meta: { requiresAuth: true, permissions: ['ranking.view'] }
}
```

---

## 10. Obsługa sesji i autoryzacji
- **useSession.js** – logika sesji, odświeżanie tokenów, auto-logout
- **cookies.js** – zarządzanie cookies (quizapp_token, quizapp_user)
- **auth.js** – obsługa logowania, rejestracji, Google OAuth

Przykład przepływu:
1. Logowanie – zapis tokenu w cookies
2. Odświeżanie sesji – automatyczne przedłużenie
3. Wylogowanie – usunięcie tokenów, przekierowanie

---

## 11. Moduł quizów
- **QuizListView.vue** – pobieranie i prezentacja quizów (paginacja, liczba pytań)
- **QuizView.vue** – obsługa pytań, odpowiedzi, obliczanie wyniku, prezentacja błędów
- **CreateView.vue** – dynamiczne dodawanie pytań/odpowiedzi, walidacja
- **mockApi.js** – przykładowe quizy, obsługa odpowiedzi, obliczanie wyniku

Przykład struktury quizu:
```js
{
  id: 1,
  title: "Quiz testowy - JavaScript",
  description: "Podstawowe pytania z JavaScript",
  questions: [
    { id: 1, question: "Co zwróci typeof null?", answers: [...] },
    // ...
  ]
}
```
Przykład obliczania wyniku:
```js
const percentage = Math.round((correctAnswers / totalQuestions) * 100)
```

---

## 12. Ranking i statystyki
- **RankingView.vue** – prezentacja globalnego rankingu, statystyk użytkownika, najpopularniejszych quizów
- **rankingService.js** – pobieranie wyników, statystyk, zapisywanie wyników

Przykład statystyk:
```js
{
  totalQuizzes: 5,
  averageScore: 80,
  bestScore: 100,
  totalCorrect: 40,
  totalQuestions: 50
}
```

---

## 13. Panel administracyjny
- **AdminView.vue** – zarządzanie quizami, użytkownikami, uprawnieniami
- Dostęp chroniony przez guardy i uprawnienia (meta: permissions)

---

## 14. Obsługa błędów i powiadomień
- **ErrorNotifications.vue** – globalne powiadomienia o błędach
- **errors.js** – zarządzanie stanem błędów
- Obsługa błędów HTTP w api.js (401, 403, 404, 409, 422)

Przykład obsługi błędów:
```js
switch (status) {
  case 401: logout(); throw new Error("Sesja wygasła.");
  case 403: throw new Error("Brak uprawnień.");
  // ...
}
```

---

## 15. Przykładowe przepływy użytkownika
### Logowanie/Rejestracja
1. Użytkownik przechodzi do LoginView/RegisterView
2. Po zalogowaniu generowana jest sesja (cookie, sessionStorage, Google OAuth)
3. Dostęp do quizów/rankingu wymaga autoryzacji

### Tworzenie quizu
1. Przejście do CreateView
2. Wypełnienie formularza quizu
3. Quiz wysyłany do backendu (POST /api/quizzes)

### Rozwiązywanie quizu
1. Wybór quizu w QuizListView
2. Rozwiązywanie w QuizView
3. Wynik przesyłany do backendu (POST /api/quizzes/:id/solve)
4. Wynik zapisywany w rankingu

### Wyświetlanie rankingu
1. Przejście do RankingView
2. Pobranie rankingu (GET /api/ranking)

---

## 16. Endpointy API
- `POST /api/quizzes` – tworzenie quizu
- `PUT /api/quizzes/:id` – edycja quizu
- `GET /api/quizzes` – pobieranie listy quizów
- `GET /api/quizzes/:id` – pobieranie szczegółów quizu
- `POST /api/quizzes/:id/solve` – przesyłanie odpowiedzi użytkownika
- `GET /api/ranking` – pobieranie rankingu
- `POST /api/auth/login` – logowanie
- `POST /api/auth/register` – rejestracja

---

## 17. Testowanie i debugowanie
- Testowanie sesji: sprawdzenie cookies, auto-logout, debugowanie w SessionDebug.vue
- Testowanie guardów: próba wejścia na trasę chronioną bez autoryzacji
- Testowanie quizów: rozwiązywanie quizów, walidacja odpowiedzi, sprawdzanie wyników

---

## 18. Rozwój projektu i onboarding
Nowe osoby powinny:
- Przeczytać README.md
- Zapoznać się z kodem w src/components, src/views, src/services
- Przejrzeć pliki w src/store oraz src/router
- Przetestować przepływy logowania, quizów, rankingu oraz sesji
- Korzystać z dokumentacji w docs/ do poznania szczegółów architektury

W razie pytań lub potrzeby rozszerzenia dokumentacji, należy kontaktować się z liderem technicznym projektu.

---

## 19. Bezpieczeństwo i Ochrona Danych

Aplikacja Quizify przykłada dużą wagę do bezpieczeństwa użytkowników oraz ochrony ich danych:

- **Autoryzacja i uprawnienia:**
  - Dostęp do quizów, rankingu i panelu admina chroniony jest przez guardy w routerze (`authGuard`, `guestGuard`).
  - Panel administracyjny wymaga specjalnych uprawnień (`meta: permissions`).
- **Sesje i tokeny:**
  - Sesje użytkowników przechowywane są w cookies (`quizapp_token`, `quizapp_user`) oraz w sessionStorage.
  - Automatyczne wylogowanie po wygaśnięciu sesji.
  - Obsługa Google OAuth zapewnia bezpieczne logowanie przez zewnętrzny provider.
- **Komunikacja z backendem:**
  - Wszystkie żądania do API wymagają autoryzacji (token JWT).
  - Obsługa błędów HTTP (401, 403, 404, 409, 422) z odpowiednimi komunikatami.
- **Dane użytkowników:**
  - Nick, email, wyniki quizów przechowywane są w bezpieczny sposób.
  - Brak wrażliwych danych w localStorage.
- **Backup i zarządzanie ryzykiem:**
  - Regularne backupy danych.
  - Rejestr ryzyk i szybka reakcja na incydenty.

---

## 20. Lista zależności i ich wersji

Projekt korzysta z następujących bibliotek i narzędzi:

- **Node.js:** v22.21.0
- **Vue:** ^3.5.22
- **Vue Router:** ^4.6.3
- **Vite:** ^5.4.8
- **Bootstrap:** ^5.x
- **Pinia:** (opcjonalnie, własny store)
- **Jest/Vitest:** (testy jednostkowe, jeśli wdrożone)
- **Google OAuth:** (autoryzacja zewnętrzna)
- **Inne:**
  - Kompozycje Vue (Composition API)
  - Custom API services (api.js, rankingService.js, mockApi.js)
  - CSS/SCSS do stylowania

Pełna lista zależności znajduje się w pliku `package.json`.