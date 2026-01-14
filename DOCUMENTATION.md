# 📚 Quizify App - Complete Documentation

> **Complete documentation for the Quizify App project - everything you need in one place**

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Quick Start Guide](#2-quick-start-guide)
3. [Features](#3-features)
4. [Installation & Setup](#4-installation--setup)
5. [User Guide](#5-user-guide)
6. [Developer Guide](#6-developer-guide)
7. [Architecture](#7-architecture)
8. [API Documentation](#8-api-documentation)
9. [Deployment](#9-deployment)
10. [Contributing](#10-contributing)
11. [Troubleshooting](#11-troubleshooting)
12. [FAQ](#12-faq)

---

# 1. Project Overview

## What is Quizify App?

Quizify App is a modern, feature-rich quiz application built with Vue 3, featuring Google OAuth authentication, real-time session management, and an intuitive user interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.22-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite)](https://vitejs.dev/)

## Key Highlights

- 📝 Create and manage custom quizzes
- 🎮 Interactive quiz-taking experience
- 🏆 Global leaderboard system
- 👤 User profiles with statistics
- 🔐 Secure Google OAuth authentication
- 📱 Fully responsive design
- ⚡ Fast and lightweight

## Technology Stack

### Frontend
- **Vue 3** (v3.5.22) - Progressive JavaScript framework
- **Vue Router** (v4.6.3) - Official router for Vue.js
- **Vite** (v5.4.8) - Next-generation frontend tooling
- **Bootstrap 5** - CSS framework for responsive design
- **Axios** (v1.12.2) - Promise-based HTTP client

### Authentication
- **Google Identity Services** - OAuth 2.0 authentication
- **@azure/msal-browser** (v3.30.0) - Microsoft Authentication Library

### Development Tools
- **Node.js** (v18+) - JavaScript runtime
- **npm** - Package manager

---

# 2. Quick Start Guide

## Prerequisites

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/en/download)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/downloads)
- **Google Cloud Account** (for OAuth credentials)

## Installation in 5 Steps

```bash
# 1. Clone the repository
git clone https://github.com/michalspoko18/quizify-app.git
cd quizify-app

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Edit .env.local with your Google Client ID
# VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# 5. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

# 3. Features

## Core Functionality

### 📝 Quiz Creation & Management
- Create custom quizzes with multiple-choice questions
- Edit existing quizzes
- Delete quizzes you own
- Add 2-4 answer options per question
- Mark correct answers
- Add explanations for learning

### 🎮 Interactive Quiz Taking
- Browse available quizzes
- Take quizzes with instant feedback
- See results immediately after submission
- View detailed answer explanations
- Retake quizzes to improve scores

### 🏆 Ranking System
- Global leaderboard
- Quiz-specific rankings
- Personal statistics tracking
- Performance analytics
- Achievement badges

### 👤 User Profiles
- Personalized profiles
- Customizable nicknames
- Activity history
- Performance statistics
- Quiz creation history

## Authentication & Security

### 🔐 Secure Authentication
- Google OAuth integration
- Cookie-based session storage
- Automatic token refresh
- HTTP-only cookies for sensitive data
- CSRF protection with SameSite cookies

### 🛡️ Advanced Security
- Role-based access control
- Permission-based routing
- Protected routes with guards
- Secure token management
- Activity tracking with auto-logout (30 min)

## User Experience

### 🎨 Modern Interface
- Dark theme by default
- Clean and intuitive design
- Bootstrap 5 components
- Smooth animations
- Loading states and feedback

### 📱 Responsive Design
- Desktop optimized
- Tablet friendly
- Mobile responsive
- Portrait and landscape support
- Touch-friendly interface

### ⚡ Performance
- Fast page loads
- Hot module replacement in development
- Optimized production builds
- Lazy loading routes
- Efficient reactivity

### 🔍 Developer Tools
- Session debug panel (dev mode)
- Vue DevTools support
- Console logging
- Error notifications
- Network request monitoring

---

# 4. Installation & Setup

## Detailed Installation

### Step 1: System Requirements

Verify your system meets the requirements:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

### Step 2: Clone Repository

```bash
git clone https://github.com/michalspoko18/quizify-app.git
cd quizify-app
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs:
- Vue 3 and Vue Router
- Axios for API calls
- Microsoft Authentication Library
- Vite build tool
- Bootstrap 5

### Step 4: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production domain
6. Copy the Client ID

### Step 5: Environment Configuration

Create `.env.local` file:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Security Settings
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false  # Set to true in production with HTTPS
```

### Step 6: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
quizify-app/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── NavBar.vue      # Navigation bar
│   │   ├── NickPanel.vue   # Nickname setup panel
│   │   ├── ErrorNotifications.vue  # Error handling
│   │   └── SessionDebug.vue        # Debug panel (dev only)
│   ├── views/              # Page components (routes)
│   │   ├── HomeView.vue    # Landing page
│   │   ├── LoginView.vue   # Authentication page
│   │   ├── QuizView.vue    # Quiz taking interface
│   │   ├── QuizListView.vue # Browse quizzes
│   │   ├── CreateView.vue  # Quiz creation
│   │   ├── RankingView.vue # Leaderboard
│   │   └── AdminView.vue   # Admin panel
│   ├── router/             # Vue Router configuration
│   │   ├── index.js        # Route definitions
│   │   └── guards.js       # Navigation guards
│   ├── store/              # State management
│   │   ├── auth.js         # Authentication state
│   │   └── errors.js       # Error handling state
│   ├── services/           # API and business logic
│   │   ├── api.js          # Axios instance and endpoints
│   │   ├── mockApi.js      # Mock API for testing
│   │   └── rankingService.js # Ranking logic
│   ├── composables/        # Vue composition functions
│   │   └── useSession.js   # Session management
│   ├── utils/              # Helper utilities
│   │   └── cookies.js      # Cookie management
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation files
├── index.html              # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md              # Project overview
```

---

# 5. User Guide

## For End Users

### Getting Started

#### 1. Sign In

1. Open the application in your browser
2. Click **"Sign in with Google"** button
3. Select your Google account
4. Grant necessary permissions
5. You'll be redirected back to the app

#### 2. Set Up Your Profile

After first login:
1. You'll be prompted to set a **nickname**
2. This appears on the leaderboard
3. Choose something unique (3-20 characters)
4. You can change it later in profile settings

### Taking Quizzes

#### Browse Quizzes

1. Click **"Quizzes"** in the navigation menu
2. Browse available quizzes
3. Each quiz shows:
   - Title and description
   - Question count
   - Difficulty level
   - Average score
   - Creator name

#### Start a Quiz

1. Click on a quiz card to view details
2. Review quiz information
3. Click **"Start Quiz"** to begin
4. Answer questions one by one
5. Click **"Next"** after each answer
6. Submit when complete

#### Tips for Better Scores

- ✅ Read questions carefully
- ✅ Review all options before selecting
- ✅ Trust your first instinct
- ✅ Look for keywords in questions
- ✅ Learn from explanations after submission

### Creating Quizzes

#### Access Quiz Creator

1. Click **"Create Quiz"** in navigation
2. Fill in quiz details:
   - **Title**: Descriptive name (5-100 characters)
   - **Description**: What the quiz covers
   - **Category**: Select appropriate category
   - **Difficulty**: Beginner/Intermediate/Advanced

#### Add Questions

1. Click **"Add Question"**
2. Enter question text clearly
3. Add 2-4 answer options
4. Mark the correct answer
5. Add explanation (recommended)
6. Repeat for all questions

#### Best Practices

✅ **DO**:
- Write clear, concise questions
- Use proper grammar and spelling
- Provide helpful explanations
- Test your quiz yourself
- Make answer options similar length

❌ **DON'T**:
- Use trick questions
- Make questions ambiguous
- Include offensive content
- Copy copyrighted content
- Make all questions too easy or hard

### Viewing Rankings

#### Global Leaderboard

1. Click **"Ranking"** in navigation
2. View top performers
3. See your current rank
4. Rankings based on:
   - Total points
   - Number of quizzes completed
   - Average score

#### Improve Your Rank

- Take more quizzes
- Aim for high scores
- Retake quizzes to improve
- Try different categories
- Maintain solving streak

### Managing Your Profile

#### Update Nickname

1. Click your name in navigation
2. Select **"Set Nickname"**
3. Enter new nickname
4. Click **"Save"**

#### View Statistics

Your profile shows:
- Total quizzes taken
- Quizzes created
- Total points
- Average score
- Global rank
- Activity history

---

# 6. Developer Guide

## Development Environment Setup

### Required Tools

#### Code Editor
- **VS Code** (Recommended)
- Extensions:
  - Volar (Vue Language Features)
  - ESLint
  - Prettier
  - GitLens

#### Browser
- Chrome or Firefox with DevTools
- Vue DevTools extension

### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "volar.takeOverMode.enabled": true
}
```

## Coding Standards

### Vue 3 Style

```vue
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// Reactive data
const count = ref(0)

// Computed properties
const doubleCount = computed(() => count.value * 2)

// Methods
function handleClick() {
  count.value++
}
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

### JavaScript Best Practices

```javascript
// ✅ Use const and let
const API_URL = 'http://localhost:8000'
let count = 0

// ✅ Use arrow functions
const double = (x) => x * 2

// ✅ Use async/await
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// ✅ Use template literals
const message = `Hello, ${name}!`

// ✅ Use optional chaining
const street = user?.address?.street

// ✅ Use nullish coalescing
const name = user.name ?? 'Guest'
```

## Development Workflow

### Branch Strategy

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

```bash
# Format: <type>(<scope>): <subject>

# Examples
feat(quiz): add timer functionality
fix(auth): resolve token refresh issue
docs(api): update authentication endpoints
style(components): format NavBar component
refactor(store): simplify auth state management
test(quiz): add unit tests
chore(deps): update dependencies
```

## Common Development Tasks

### Adding a New Component

```vue
<!-- src/components/NewComponent.vue -->
<template>
  <div class="new-component">
    <h2>{{ title }}</h2>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.new-component {
  padding: 20px;
}
</style>
```

### Adding a New Route

```javascript
// src/router/index.js
import NewView from '@/views/NewView.vue'

const routes = [
  {
    path: '/new-page',
    name: 'new-page',
    component: NewView,
    meta: {
      requiresAuth: true,
      title: 'New Page'
    }
  }
]
```

### Adding API Endpoint

```javascript
// src/services/api.js
export const newAPI = {
  getData: () => api.get('/new-endpoint'),
  postData: (data) => api.post('/new-endpoint', data),
  updateData: (id, data) => api.put(`/new-endpoint/${id}`, data),
  deleteData: (id) => api.delete(`/new-endpoint/${id}`)
}
```

## Debugging

### Vue DevTools

1. Install Vue DevTools extension
2. Open DevTools (F12)
3. Navigate to "Vue" tab
4. Inspect components and state

### Console Debugging

```javascript
// Add breakpoints
debugger

// Console logging
console.log('Debug:', variable)
console.table(array)
console.time('operation')
// ... code
console.timeEnd('operation')
```

### Session Debug Panel

Built-in debug panel (dev mode):
- Bottom-right corner (🔐 icon)
- Shows session status
- Token expiry info
- Manual refresh/logout controls

---

# 7. Architecture

## System Architecture

```
┌─────────────────────────────────────────────┐
│              Browser                         │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────┐    │
│  │   Quizify Vue 3 Application        │    │
│  │                                     │    │
│  │  ┌──────────┐  ┌────────────────┐ │    │
│  │  │Components│  │Router & Store  │ │    │
│  │  └──────────┘  └────────────────┘ │    │
│  │                                     │    │
│  │  ┌──────────┐  ┌────────────────┐ │    │
│  │  │Services  │  │Composables     │ │    │
│  │  └──────────┘  └────────────────┘ │    │
│  └────────────────────────────────────┘    │
│                     ↕                        │
│  ┌────────────────────────────────────┐    │
│  │      Axios HTTP Client             │    │
│  └────────────────────────────────────┘    │
└───────────────────┬─────────────────────────┘
                    ↕
┌───────────────────┴─────────────────────────┐
│         Backend API Server                  │
│       (FastAPI / Django / etc.)             │
└─────────────────────────────────────────────┘
```

## Frontend Architecture

### Layer Structure

1. **Presentation Layer** - Views & Components
2. **Business Logic Layer** - Services & Composables
3. **State Management Layer** - Store
4. **Routing Layer** - Router with guards
5. **Utility Layer** - Helper functions

### Component Hierarchy

```
App.vue (Root)
├── NavBar.vue
├── RouterView
│   ├── HomeView.vue
│   ├── LoginView.vue
│   ├── QuizListView.vue
│   ├── QuizView.vue
│   ├── CreateView.vue
│   ├── RankingView.vue
│   └── AdminView.vue
├── NickPanel.vue
├── ErrorNotifications.vue
└── SessionDebug.vue (dev only)
```

## State Management

### Reactive Store Pattern

```javascript
// src/store/auth.js
import { reactive, readonly } from 'vue'

const state = reactive({
  account: null,
  idToken: null,
  refreshToken: null,
  permissions: []
})

export function useAuth() {
  return {
    store: readonly(state),
    login,
    logout,
    hasPermission
  }
}
```

## Authentication Flow

1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User authenticates with Google
4. Callback with Google token
5. Exchange token with backend
6. Receive access & refresh tokens
7. Store in secure cookies
8. Redirect to application

## Security Features

### Cookie Security
- HTTP-only cookies for refresh tokens
- Secure flag for HTTPS
- SameSite=Strict for CSRF protection
- Proper expiry times

### Route Protection
- Authentication guards
- Permission-based access
- Redirect loop prevention
- Session validation

### API Security
- Bearer token authentication
- CORS configuration
- Request validation
- Error sanitization

---

# 8. API Documentation

## Base Configuration

```
Base URL: http://localhost:8000/api
Content-Type: application/json
Authentication: Bearer Token
```

## Authentication Endpoints

### POST /auth/google

Login with Google OAuth token.

**Request:**
```json
{
  "idToken": "google_id_token",
  "clientId": "your_google_client_id"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "permissions": ["user", "quiz.create"]
  },
  "expiresIn": 900
}
```

### POST /auth/refresh

Refresh access token.

**Request:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 900
}
```

### POST /auth/logout

Logout and invalidate session.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

## Quiz Management

### GET /quizzes

Get all quizzes.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `search`: Search in title/description

**Response (200 OK):**
```json
{
  "quizzes": [
    {
      "id": "quiz_123",
      "title": "JavaScript Basics",
      "description": "Test your knowledge",
      "category": "Programming",
      "difficulty": "beginner",
      "questionCount": 10,
      "author": {
        "id": "user_456",
        "name": "Jane Doe"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

### GET /quizzes/:id

Get quiz by ID with questions.

**Response (200 OK):**
```json
{
  "id": "quiz_123",
  "title": "JavaScript Basics",
  "questions": [
    {
      "id": "q1",
      "text": "What is typeof null?",
      "options": [
        { "id": "a", "text": "null" },
        { "id": "b", "text": "object" },
        { "id": "c", "text": "undefined" }
      ],
      "points": 10
    }
  ]
}
```

### POST /quizzes

Create new quiz.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "title": "My Quiz",
  "description": "Quiz description",
  "category": "Programming",
  "difficulty": "beginner",
  "questions": [
    {
      "text": "Question text?",
      "options": [
        { "text": "Option A", "isCorrect": false },
        { "text": "Option B", "isCorrect": true }
      ],
      "points": 10
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": "quiz_789",
  "message": "Quiz created successfully"
}
```

### POST /quizzes/:id/submit

Submit quiz answers.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "answers": [
    { "questionId": "q1", "selectedOption": "b" },
    { "questionId": "q2", "selectedOption": "a" }
  ],
  "timeSpent": 180
}
```

**Response (200 OK):**
```json
{
  "score": 80,
  "totalPoints": 30,
  "earnedPoints": 24,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "results": [
    {
      "questionId": "q1",
      "correct": true,
      "selectedOption": "b",
      "correctOption": "b",
      "explanation": "Correct!"
    }
  ],
  "leaderboardPosition": 15
}
```

## Ranking System

### GET /ranking

Get global leaderboard.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `period`: Time period (all, monthly, weekly)

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "nickname": "quizmaster",
      "totalPoints": 5420,
      "quizzesTaken": 68,
      "averageScore": 91.2
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10
  }
}
```

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {},
    "timestamp": "2024-01-20T18:00:00Z"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Auth required |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

# 9. Deployment

## Building for Production

### Step 1: Create Production Environment

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.quizify-app.com/api
VITE_GOOGLE_CLIENT_ID=production_client_id
VITE_COOKIE_DOMAIN=quizify-app.com
VITE_COOKIE_SECURE=true
```

### Step 2: Build Application

```bash
npm run build
```

Creates optimized `dist/` directory.

### Step 3: Preview Build

```bash
npm run preview
```

Visit `http://localhost:4173` to test.

## Deployment Platforms

### Vercel (Recommended)

**Why Vercel?**
- Automatic deployments from Git
- Free SSL certificates
- Global CDN
- Environment variable management

**Deploy Steps:**

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect GitHub repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Click "Deploy"

### Netlify

**Deploy Steps:**

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables
6. Deploy

### Docker

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run:**

```bash
docker build -t quizify-app .
docker run -d -p 80:80 quizify-app
```

## Post-Deployment Checklist

- [ ] Application loads without errors
- [ ] Google OAuth works
- [ ] API calls succeed
- [ ] All routes accessible
- [ ] Mobile responsive
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured
- [ ] Performance optimized
- [ ] Analytics setup
- [ ] Error tracking configured

---

# 10. Contributing

## How to Contribute

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Commit**: `git commit -m 'feat: add amazing feature'`
5. **Push**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

## Contribution Guidelines

### Code Quality

- Follow Vue.js style guide
- Use Composition API
- Write clear commit messages
- Add comments for complex logic
- Test your changes

### Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update README if adding features
4. Request review from maintainers
5. Address review comments

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Components are reusable
- [ ] No hardcoded values
- [ ] Responsive design works
- [ ] Git commits are clean

## Reporting Bugs

Include in bug reports:
- What you were trying to do
- What actually happened
- Browser and device info
- Screenshots if applicable
- Steps to reproduce

## Feature Requests

When suggesting features:
- Clear description
- Use case / why it's needed
- How it should work
- Mockups if applicable

---

# 11. Troubleshooting

## Common Issues

### Cannot Sign In

**Problem**: Login button doesn't work

**Solutions**:
1. Clear browser cache and cookies
2. Disable ad blockers
3. Try different browser
4. Check if Google accounts accessible
5. Verify Google OAuth configuration

### Quiz Won't Load

**Problem**: Quiz page shows error

**Solutions**:
1. Refresh page (F5)
2. Check internet connection
3. Try different quiz
4. Clear browser cache
5. Check browser console for errors

### Development Server Won't Start

**Problem**: `npm run dev` fails

**Solutions**:
1. Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. Check Node.js version (must be 18+)
3. Check port 5173 isn't in use
4. Try different port: `npm run dev -- --port 3000`

### Build Fails

**Problem**: `npm run build` shows errors

**Solutions**:
1. Check all imports are correct
2. Verify environment variables
3. Run `npm run dev` first to catch errors
4. Check for TypeScript/linting errors
5. Clear cache: `rm -rf dist`

### Environment Variables Not Working

**Problem**: Variables not loading

**Solutions**:
1. Ensure variables start with `VITE_`
2. Restart dev server after changing `.env`
3. Check `.env.local` file exists
4. Verify syntax (no quotes needed)

### CORS Errors

**Problem**: API requests fail with CORS error

**Solutions**:
1. Check backend CORS configuration
2. Verify API URL in environment variables
3. Check if backend is running
4. Use proxy in `vite.config.js` for development

### Session Not Persisting

**Problem**: Logged out after refresh

**Solutions**:
1. Check if cookies are enabled
2. Verify cookie domain in `.env`
3. Check browser privacy settings
4. Clear all cookies and try again

## Browser Compatibility

**Supported**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Not Supported**:
- ❌ Internet Explorer
- ❌ Old browser versions

## Getting Help

1. Check this documentation
2. Search GitHub Issues
3. Check browser console
4. Use Vue DevTools
5. Create new GitHub issue

---

# 12. FAQ

## General Questions

**Q: Is Quizify App free to use?**  
A: Yes, completely free and open-source.

**Q: Do I need a Google account?**  
A: Yes, Google Sign-In is the authentication method.

**Q: Can I use without signing in?**  
A: No, authentication is required for all features.

**Q: Is my data safe?**  
A: Yes, we use secure authentication and encrypt sensitive data.

**Q: Which browsers are supported?**  
A: Chrome, Firefox, Safari, and Edge (modern versions).

## Quiz Taking

**Q: Can I pause a quiz?**  
A: Currently not supported. Complete in one session.

**Q: Is there a time limit?**  
A: Most quizzes don't have time limits unless specified.

**Q: Can I go back to previous questions?**  
A: Not currently supported. Answer carefully.

**Q: How is score calculated?**  
A: Score = (Correct Answers / Total Questions) × 100%

**Q: Can I retake a quiz?**  
A: Yes, unlimited retakes. Best score counts for leaderboard.

## Quiz Creation

**Q: How many questions should a quiz have?**  
A: Minimum 1, but 10-20 is ideal for engagement.

**Q: Can I edit after publishing?**  
A: Yes, edit anytime from "My Quizzes".

**Q: Can I make quiz private?**  
A: Currently all quizzes are public. Private mode is planned.

**Q: Can I add images to questions?**  
A: Not currently supported. Planned for future.

## Technical

**Q: Which devices are supported?**  
A: Desktop, laptop, tablet, and mobile with modern browsers.

**Q: Do I need to install anything?**  
A: No, it's a web application. Just use your browser.

**Q: Where is data stored?**  
A: On secure servers. Session data in browser cookies.

**Q: How do I report bugs?**  
A: Create an issue on GitHub with details.

**Q: Can I contribute to the project?**  
A: Yes! See Contributing section above.

---

## License

This project is licensed under the MIT License.

## Authors

- **Michał Spoko** - [@michalspoko18](https://github.com/michalspoko18)

## Acknowledgments

- Vue.js team for the amazing framework
- Bootstrap team for UI components
- Google for OAuth integration
- All contributors

---

**Made with ❤️ using Vue 3 and Vite**

*Last Updated: January 2026*
