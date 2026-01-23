# quizify-app

Frontend dla aplikacji Quizify. Projekt oparty o Vue 3 + Vite.

**Stack**
- Vue 3
- Vite
- Vue Router
- Axios
- @azure/msal-browser

**Wymagania**
- Node.js >= 18

**Szybki start (lokalnie)**
```bash
npm install
npm run dev
```

Aplikacja startuje pod `http://localhost:5173`.

**Konfiguracja (.env.local)**
Utworz plik `.env.local` w katalogu projektu:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_GOOGLE_CLIENT_ID=twoj-google-client-id
```

**Backend (quizify-api)**
- API powinno dzialac pod `http://127.0.0.1:8000`.
- `VITE_GOOGLE_CLIENT_ID` musi pasowac do `GOOGLE_CLIENT_ID` w backendzie.

**Skrypty**
- `npm run dev` - lokalny dev server
- `npm run build` - build produkcyjny
- `npm run preview` - podglad buildu

**Sesje**
- Szczegoly w `SESSION_MANAGEMENT.md`.
