# 🎯 Quizify App

> A modern, feature-rich quiz application built with Vue 3, featuring Google OAuth authentication, real-time session management, and an intuitive user interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3.5.22-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite)](https://vitejs.dev/)

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Technology Stack](#-technology-stack)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- 📝 **Quiz Creation & Management** - Create, edit, and manage custom quizzes with multiple-choice questions
- 🎮 **Interactive Quiz Taking** - Engaging interface for solving quizzes with instant feedback
- 🏆 **Ranking System** - Track scores and compete with other users on the leaderboard
- 👤 **User Profiles** - Personalized profiles with customizable nicknames and statistics

### Authentication & Security
- 🔐 **Google OAuth Integration** - Secure authentication using Google Sign-In
- 🍪 **Advanced Session Management** - Cookie-based session storage with automatic refresh
- 🛡️ **Role-Based Access Control** - Permission-based routing and feature access
- 🔄 **Auto-Refresh Tokens** - Seamless token renewal with 30-minute activity tracking
- 🚪 **Route Guards** - Protected routes with automatic redirects

### User Experience
- 🎨 **Modern Dark UI** - Beautiful dark theme using Bootstrap 5
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance
- 🌐 **Multi-language Support** - Polish interface with easy extensibility
- 🔔 **Real-time Notifications** - Error handling and user feedback system
- 🔍 **Debug Panel** - Development tools for session monitoring (dev mode only)

### Developer Features
- 🏗️ **Clean Architecture** - Well-organized component structure
- 🧩 **Composition API** - Modern Vue 3 patterns and composables
- 📦 **Modular Services** - Separated API and business logic
- 🧪 **Developer Tools** - Session debug panel and comprehensive logging
- 🔧 **Easy Configuration** - Environment-based setup

## 📸 Screenshots

*Coming soon - Screenshots will showcase the main dashboard, quiz creation, quiz solving, and ranking views.*

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/michalspoko18/quizify-app.git
cd quizify-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Google Client ID

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/en/download)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/downloads)
- **Google Cloud Account** - For OAuth credentials (optional for development)

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB for project and dependencies

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/michalspoko18/quizify-app.git
cd quizify-app
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Vue 3 and Vue Router
- Axios for API calls
- Microsoft Authentication Library (MSAL)
- Vite build tool

### 3. Configure Environment

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Security Settings
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false  # Set to true in production with HTTPS
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - Your production domain
6. Copy the Client ID to your `.env.local` file

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | - | Yes |
| `VITE_API_BASE_URL` | Backend API URL | `http://127.0.0.1:8000/api` | No |
| `VITE_COOKIE_DOMAIN` | Cookie domain for auth | `localhost` | No |
| `VITE_COOKIE_SECURE` | Use secure cookies (HTTPS) | `false` | No |

## 🎯 Usage

### For Users

1. **Sign In**: Click "Sign in with Google" on the login page
2. **Set Nickname**: Create your unique nickname for the leaderboard
3. **Browse Quizzes**: View available quizzes on the quiz list page
4. **Take Quiz**: Select a quiz and answer the questions
5. **View Results**: See your score and compare with others
6. **Check Ranking**: View your position on the global leaderboard

### For Quiz Creators

1. **Create Quiz**: Navigate to "Create Quiz" from the menu
2. **Add Questions**: Add multiple-choice questions with 2-4 answers
3. **Mark Correct Answers**: Select the correct answer for each question
4. **Save Quiz**: Publish your quiz for others to solve
5. **Edit Quiz**: Modify your existing quizzes anytime

### For Administrators

1. **Access Admin Panel**: Available if you have admin permissions
2. **Manage Users**: View and manage user accounts
3. **Moderate Quizzes**: Review and manage all quizzes
4. **View Analytics**: Access system statistics and reports

## 📁 Project Structure

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
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # Architecture overview
│   ├── API.md              # API documentation
│   ├── DEVELOPER_GUIDE.md  # Developer guide
│   ├── USER_GUIDE.md       # User manual
│   └── DEPLOYMENT.md       # Deployment instructions
├── public/                 # Static assets
├── .github/                # GitHub configuration
├── index.html              # HTML entry point
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
├── .env.local             # Environment variables (not in git)
└── README.md              # This file
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[API Documentation](./docs/API.md)** - Backend API endpoints and usage
- **[Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Development setup and guidelines
- **[User Guide](./docs/USER_GUIDE.md)** - End-user instructions
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment steps
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - How to contribute
- **[Session Management](./SESSION_MANAGEMENT.md)** - Authentication deep-dive
- **[Frontend Documentation](./docs/frontend.md)** - Frontend architecture (Polish)

## 🛠️ Technology Stack

### Frontend
- **[Vue 3](https://vuejs.org/)** (v3.5.22) - Progressive JavaScript framework
- **[Vue Router](https://router.vuejs.org/)** (v4.6.3) - Official router for Vue.js
- **[Vite](https://vitejs.dev/)** (v5.4.8) - Next-generation frontend tooling
- **[Bootstrap 5](https://getbootstrap.com/)** - CSS framework for responsive design
- **[Axios](https://axios-http.com/)** (v1.12.2) - Promise-based HTTP client

### Authentication
- **[Google Identity Services](https://developers.google.com/identity)** - OAuth 2.0 authentication
- **[@azure/msal-browser](https://www.npmjs.com/package/@azure/msal-browser)** (v3.30.0) - Microsoft Authentication Library

### Development Tools
- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[npm](https://www.npmjs.com/)** - Package manager
- **ESLint** - Code linting (optional)
- **Prettier** - Code formatting (optional)

### Build & Deployment
- **Vite** - Development server and build tool
- **Static hosting** - Can be deployed to Vercel, Netlify, GitHub Pages, etc.

## 🧑‍💻 Development

### Available Scripts

```bash
# Start development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests (if configured)
npm run test

# Lint code (if configured)
npm run lint
```

### Code Style

This project follows Vue.js style guide and best practices:
- Use Composition API with `<script setup>`
- Follow component naming conventions (PascalCase)
- Use reactive variables with `ref()` and `reactive()`
- Implement proper error handling
- Write clean, documented code

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and test thoroughly
3. Commit with clear messages: `git commit -m "feat: add new feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Create a Pull Request

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./docs/CONTRIBUTING.md) for details on:
- Code of conduct
- Development process
- Pull request process
- Coding standards

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Authors

- **Michał Spoko** - Initial work - [@michalspoko18](https://github.com/michalspoko18)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Bootstrap team for the UI components
- Google for OAuth integration
- All contributors who help improve this project

## 📞 Support

If you have any questions or need help:
- 📧 Open an issue on GitHub
- 💬 Check existing documentation
- 🌟 Star the repository if you find it useful!

## 🗺️ Roadmap

Future enhancements planned:
- [ ] Multi-language support (English, Polish, etc.)
- [ ] Quiz categories and tags
- [ ] Timed quizzes
- [ ] Question types (true/false, fill-in-the-blank)
- [ ] Quiz sharing and collaboration
- [ ] Advanced statistics and analytics
- [ ] Mobile app (React Native/Flutter)
- [ ] Export/import quiz functionality
- [ ] Dark/light theme toggle

---

**Made with ❤️ using Vue 3 and Vite**
