# 🧑‍💻 Developer Guide

## Welcome, Developer!

This guide will help you set up your development environment, understand the codebase, and contribute effectively to the Quizify App project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Debugging](#debugging)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/michalspoko18/quizify-app.git
cd quizify-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your settings
# You'll need a Google OAuth Client ID
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

### First-Time Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Google OAuth configured (optional for testing)
- [ ] Browser opened to localhost:5173

## Development Environment

### Recommended Tools

#### Code Editor
- **VS Code** (Recommended)
  - Install: [https://code.visualstudio.com/](https://code.visualstudio.com/)
  - Extensions:
    - Volar (Vue Language Features)
    - ESLint
    - Prettier
    - GitLens
    - Auto Import

#### Browser
- **Chrome** or **Firefox** with DevTools
- Install Vue DevTools extension:
  - [Chrome](https://chrome.google.com/webstore/detail/vuejs-devtools)
  - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

#### Terminal
- Built-in terminal in VS Code
- Or use iTerm2 (Mac), Windows Terminal (Windows), or GNOME Terminal (Linux)

### VS Code Configuration

Create `.vscode/settings.json` in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue"
  ],
  "vetur.validation.template": false,
  "volar.takeOverMode.enabled": true
}
```

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "steoates.autoimport",
    "formulahendry.auto-rename-tag",
    "naumovs.color-highlight"
  ]
}
```

## Project Structure

### Directory Layout

```
quizify-app/
├── .github/              # GitHub configuration
│   ├── ISSUE_TEMPLATE/  # Issue templates
│   └── workflows/       # CI/CD workflows (if any)
├── docs/                # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEVELOPER_GUIDE.md (this file)
│   ├── USER_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── public/              # Static assets (served as-is)
├── src/                 # Source code
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── composables/    # Composition API functions
│   ├── router/         # Vue Router configuration
│   ├── services/       # API and business logic
│   ├── store/          # State management
│   ├── utils/          # Helper utilities
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   └── main.js         # Entry point
├── .env.local          # Environment variables (not in git)
├── .gitignore          # Git ignore rules
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # Project overview
```

### File Naming Conventions

- **Components**: PascalCase (e.g., `NavBar.vue`, `QuizCard.vue`)
- **Views**: PascalCase with "View" suffix (e.g., `HomeView.vue`)
- **Composables**: camelCase with "use" prefix (e.g., `useSession.js`)
- **Services**: camelCase (e.g., `api.js`, `rankingService.js`)
- **Utils**: camelCase (e.g., `cookies.js`, `validators.js`)

## Coding Standards

### Vue 3 Style Guide

Follow the [Vue.js Style Guide](https://vuejs.org/style-guide/):

#### Component Structure

```vue
<template>
  <!-- Template content -->
  <div class="container">
    <h1>{{ title }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  title: String,
  required: Boolean
})

// Emits
const emit = defineEmits(['submit', 'cancel'])

// Reactive data
const count = ref(0)

// Computed properties
const doubleCount = computed(() => count.value * 2)

// Methods
function handleClick() {
  count.value++
  emit('submit', count.value)
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

#### Composition API Best Practices

```javascript
// ✅ DO: Use script setup
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

// ❌ DON'T: Use Options API for new code
<script>
export default {
  data() {
    return { count: 0 }
  }
}
</script>

// ✅ DO: Use ref for primitives, reactive for objects
const name = ref('John')
const user = reactive({ name: 'John', age: 30 })

// ❌ DON'T: Use reactive for primitives
const count = reactive(0) // This won't work!

// ✅ DO: Destructure with toRefs
const { name, age } = toRefs(user)

// ❌ DON'T: Destructure reactive objects directly
const { name, age } = user // Loses reactivity!
```

### JavaScript Style

```javascript
// ✅ DO: Use const and let
const API_URL = 'http://localhost:8000'
let count = 0

// ❌ DON'T: Use var
var count = 0

// ✅ DO: Use arrow functions
const double = (x) => x * 2

// ✅ DO: Use async/await
async function fetchData() {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// ❌ DON'T: Use .then() chains for new code
function fetchData() {
  return api.get('/data')
    .then(response => response.data)
    .catch(error => console.error(error))
}

// ✅ DO: Use template literals
const message = `Hello, ${name}!`

// ❌ DON'T: Use string concatenation
const message = 'Hello, ' + name + '!'

// ✅ DO: Use destructuring
const { name, age } = user
const [first, second] = array

// ✅ DO: Use optional chaining
const street = user?.address?.street

// ✅ DO: Use nullish coalescing
const name = user.name ?? 'Guest'
```

### Component Guidelines

#### Props Definition

```javascript
// ✅ DO: Define props with types and validation
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  items: {
    type: Array,
    default: () => []
  }
})

// ❌ DON'T: Use minimal prop definitions for complex components
defineProps(['title', 'count', 'items'])
```

#### Event Naming

```javascript
// ✅ DO: Use kebab-case for events
emit('update-value', newValue)
emit('submit-form', formData)

// ❌ DON'T: Use camelCase for events
emit('updateValue', newValue)
```

#### Composables Pattern

```javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  // State
  const count = ref(initialValue)
  
  // Computed
  const doubled = computed(() => count.value * 2)
  
  // Methods
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  // Return public API
  return {
    count: readonly(count),
    doubled,
    increment,
    decrement,
    reset
  }
}

// Usage in component
<script setup>
import { useCounter } from '@/composables/useCounter'

const counter = useCounter(10)
</script>
```

### CSS/Styling Guidelines

```vue
<style scoped>
/* ✅ DO: Use scoped styles */
.button {
  padding: 10px 20px;
  background-color: #007bff;
}

/* ✅ DO: Use CSS variables for theming */
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
}

/* ✅ DO: Use BEM naming for complex components */
.quiz-card { }
.quiz-card__header { }
.quiz-card__title { }
.quiz-card__body { }
.quiz-card--featured { }

/* ❌ DON'T: Use overly specific selectors */
.container .row .col .card .card-body .button { }

/* ✅ DO: Use classes over IDs for styling */
.header { }

/* ❌ DON'T: Use IDs for styling */
#header { }
</style>
```

## Development Workflow

### Branch Strategy

```bash
# Main branches
main          # Production-ready code
develop       # Integration branch (if using GitFlow)

# Feature branches
feature/quiz-timer
feature/user-profile
fix/login-bug
docs/api-documentation

# Create a new feature branch
git checkout -b feature/your-feature-name

# Work on your feature
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

# Types
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks

# Examples
feat(quiz): add timer functionality
fix(auth): resolve token refresh issue
docs(api): update authentication endpoints
style(components): format NavBar component
refactor(store): simplify auth state management
test(quiz): add unit tests for quiz submission
chore(deps): update dependencies
```

### Development Process

1. **Pick a task** from GitHub Issues
2. **Create a branch** from `main`
3. **Write code** following standards
4. **Test your changes** locally
5. **Commit** with clear messages
6. **Push** to your branch
7. **Create Pull Request**
8. **Address review comments**
9. **Merge** when approved

### Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] No console.log statements (use proper logging)
- [ ] No commented-out code
- [ ] Proper error handling
- [ ] Components are reusable
- [ ] No hardcoded values (use constants/config)
- [ ] Responsive design works
- [ ] No TypeScript/linting errors
- [ ] Git commits are clean and meaningful
- [ ] PR description explains changes

## Testing

### Manual Testing

```bash
# Start dev server
npm run dev

# Test in browser
open http://localhost:5173
```

#### Testing Checklist

- [ ] Authentication (login/logout)
- [ ] Quiz creation
- [ ] Quiz taking
- [ ] Ranking display
- [ ] Session persistence
- [ ] Error handling
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### Unit Testing (Future)

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Debugging

### Vue DevTools

1. Install Vue DevTools browser extension
2. Open DevTools (F12)
3. Navigate to "Vue" tab
4. Inspect components, state, and events

### Browser DevTools

```javascript
// Add breakpoints in Sources tab
debugger

// Console logging
console.log('Debug:', variable)
console.table(array)
console.group('Group Name')
console.groupEnd()

// Performance profiling
console.time('operation')
// ... code to measure
console.timeEnd('operation')
```

### Session Debug Panel

The app includes a built-in debug panel (development mode only):

- Located in bottom-right corner (🔐 icon)
- Shows session status
- Token expiry information
- Manual refresh/logout controls

### Common Debug Scenarios

#### Authentication Issues

```javascript
// Check if user is authenticated
import { useAuth } from '@/store/auth'
const auth = useAuth()
console.log('Is authenticated:', auth.store.isAuth)
console.log('User data:', auth.store.account)
console.log('Permissions:', auth.store.permissions)
```

#### API Call Issues

```javascript
// Check API requests in Network tab
// Add debugging to axios interceptors in services/api.js

api.interceptors.request.use(config => {
  console.log('API Request:', config.method, config.url)
  return config
})

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  error => {
    console.error('API Error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)
```

#### Routing Issues

```javascript
// Check route guards
router.beforeEach((to, from, next) => {
  console.log('Navigation:', from.path, '->', to.path)
  console.log('Route meta:', to.meta)
  next()
})
```

## Common Tasks

### Adding a New Component

1. Create component file:
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

2. Import and use:
```vue
<script setup>
import NewComponent from '@/components/NewComponent.vue'
</script>

<template>
  <NewComponent title="Hello World" />
</template>
```

### Adding a New Route

```javascript
// src/router/index.js
import NewView from '@/views/NewView.vue'

const routes = [
  // ... existing routes
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

### Adding a New API Endpoint

```javascript
// src/services/api.js
export const newAPI = {
  getData: () => api.get('/new-endpoint'),
  postData: (data) => api.post('/new-endpoint', data),
  updateData: (id, data) => api.put(`/new-endpoint/${id}`, data),
  deleteData: (id) => api.delete(`/new-endpoint/${id}`)
}
```

### Creating a Composable

```javascript
// src/composables/useNewFeature.js
import { ref, computed } from 'vue'

export function useNewFeature(options = {}) {
  const state = ref(options.initialState || null)
  
  const derivedValue = computed(() => {
    return state.value ? state.value.toUpperCase() : ''
  })
  
  function updateState(newValue) {
    state.value = newValue
  }
  
  return {
    state,
    derivedValue,
    updateState
  }
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port 5173
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process or use a different port
npm run dev -- --port 3000
```

#### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Vite HMR Not Working

```bash
# Restart dev server
# Check browser console for errors
# Clear browser cache
```

#### Google OAuth Not Working

```bash
# Check environment variable
echo $VITE_GOOGLE_CLIENT_ID

# Verify OAuth redirect URIs in Google Console
# Check browser console for errors
```

### Getting Help

1. Check existing documentation
2. Search GitHub Issues
3. Check browser console for errors
4. Use Vue DevTools for component inspection
5. Ask in team chat or create an issue

## Best Practices

### Performance

- Use `v-show` for frequently toggled elements
- Use `v-if` for rarely changed elements
- Lazy load routes with dynamic imports
- Optimize images (use appropriate formats and sizes)
- Debounce expensive operations
- Use virtual scrolling for large lists

### Security

- Never commit `.env.local` or secrets
- Sanitize user input
- Use HTTPS in production
- Validate data on both client and server
- Implement proper CORS
- Use HTTP-only cookies for sensitive tokens

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast
- Provide alternative text for images

### Code Organization

- Keep components small and focused
- Extract reusable logic into composables
- Use consistent naming conventions
- Group related files together
- Document complex logic with comments
- Avoid deep nesting

### Git Practices

- Commit often with clear messages
- Keep commits focused (one logical change)
- Don't commit generated files
- Review your changes before committing
- Pull latest changes before starting work
- Resolve conflicts carefully

## Additional Resources

### Official Documentation

- [Vue 3](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)

### Learning Resources

- [Vue Mastery](https://www.vuemastery.com/)
- [Vue School](https://vueschool.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Tools

- [Vue DevTools](https://devtools.vuejs.org/)
- [Vite Plugin Ecosystem](https://vitejs.dev/plugins/)

---

## Conclusion

You're now ready to contribute to Quizify App! Remember to:

- Follow coding standards
- Write clean, maintainable code
- Test your changes thoroughly
- Ask questions when needed
- Have fun coding! 🚀

For more information, check out:
- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

Happy coding! 💻✨
