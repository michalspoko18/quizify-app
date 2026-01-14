# 📡 API Documentation

## Overview

This document describes the API endpoints used by the Quizify App frontend. The backend API follows RESTful principles and uses JSON for request/response payloads.

## Base Configuration

```javascript
Base URL: http://localhost:8000/api
Content-Type: application/json
Authentication: Bearer Token (in Authorization header)
```

## Table of Contents

- [Authentication](#authentication)
- [Quiz Management](#quiz-management)
- [User Management](#user-management)
- [Ranking System](#ranking-system)
- [Error Handling](#error-handling)
- [Request/Response Examples](#requestresponse-examples)

## Authentication

### Login with Google

Exchange Google OAuth token for application tokens.

**Endpoint:** `POST /auth/google`

**Request:**
```json
{
  "idToken": "google_id_token_here",
  "clientId": "your_google_client_id"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/avatar.jpg",
    "permissions": ["user", "quiz.create"]
  },
  "expiresIn": 900
}
```

**Errors:**
- `400 Bad Request` - Invalid token or client ID
- `401 Unauthorized` - Token verification failed
- `500 Internal Server Error` - Server error

---

### Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
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

**Errors:**
- `401 Unauthorized` - Invalid or expired refresh token
- `500 Internal Server Error` - Server error

---

### Logout

Invalidate current session and tokens.

**Endpoint:** `POST /auth/logout`

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

---

### Get Current User

Get authenticated user information.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "nickname": "johnny",
  "picture": "https://example.com/avatar.jpg",
  "permissions": ["user", "quiz.create"],
  "createdAt": "2024-01-01T00:00:00Z",
  "stats": {
    "quizzesTaken": 15,
    "averageScore": 85.5,
    "totalPoints": 1280
  }
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

## Quiz Management

### Get All Quizzes

Retrieve a list of all available quizzes.

**Endpoint:** `GET /quizzes`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category
- `search` (optional): Search in title/description
- `sortBy` (optional): Sort field (created, title, difficulty)
- `order` (optional): Sort order (asc, desc)

**Example:** `GET /quizzes?page=1&limit=10&sortBy=created&order=desc`

**Response (200 OK):**
```json
{
  "quizzes": [
    {
      "id": "quiz_123",
      "title": "JavaScript Basics",
      "description": "Test your knowledge of JavaScript fundamentals",
      "category": "Programming",
      "difficulty": "beginner",
      "questionCount": 10,
      "author": {
        "id": "user_456",
        "name": "Jane Doe",
        "nickname": "janedoe"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "stats": {
        "attempts": 245,
        "averageScore": 78.5
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

---

### Get Quiz by ID

Retrieve detailed information about a specific quiz.

**Endpoint:** `GET /quizzes/:id`

**Parameters:**
- `id` (required): Quiz ID

**Response (200 OK):**
```json
{
  "id": "quiz_123",
  "title": "JavaScript Basics",
  "description": "Test your knowledge of JavaScript fundamentals",
  "category": "Programming",
  "difficulty": "beginner",
  "author": {
    "id": "user_456",
    "name": "Jane Doe",
    "nickname": "janedoe"
  },
  "questions": [
    {
      "id": "q1",
      "text": "What is the output of typeof null in JavaScript?",
      "type": "multiple_choice",
      "options": [
        { "id": "a", "text": "null" },
        { "id": "b", "text": "object" },
        { "id": "c", "text": "undefined" },
        { "id": "d", "text": "number" }
      ],
      "points": 10
    }
  ],
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "stats": {
    "attempts": 245,
    "averageScore": 78.5,
    "completionRate": 92.3
  }
}
```

**Errors:**
- `404 Not Found` - Quiz not found
- `403 Forbidden` - No access to private quiz

---

### Create Quiz

Create a new quiz (requires authentication).

**Endpoint:** `POST /quizzes`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "title": "Advanced Vue.js",
  "description": "Advanced concepts in Vue.js 3",
  "category": "Programming",
  "difficulty": "advanced",
  "isPublic": true,
  "questions": [
    {
      "text": "What is the Composition API?",
      "type": "multiple_choice",
      "options": [
        { "text": "A way to compose components", "isCorrect": false },
        { "text": "A new way to organize component logic", "isCorrect": true },
        { "text": "A styling framework", "isCorrect": false },
        { "text": "A build tool", "isCorrect": false }
      ],
      "points": 10,
      "explanation": "The Composition API is a new way to organize component logic in Vue 3"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": "quiz_789",
  "title": "Advanced Vue.js",
  "description": "Advanced concepts in Vue.js 3",
  "category": "Programming",
  "difficulty": "advanced",
  "author": {
    "id": "user_123",
    "name": "John Doe",
    "nickname": "johndoe"
  },
  "questionCount": 1,
  "createdAt": "2024-01-20T14:00:00Z",
  "message": "Quiz created successfully"
}
```

**Errors:**
- `400 Bad Request` - Invalid data (validation errors)
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No permission to create quizzes

---

### Update Quiz

Update an existing quiz (requires authentication and ownership).

**Endpoint:** `PUT /quizzes/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Parameters:**
- `id` (required): Quiz ID

**Request:**
```json
{
  "title": "Advanced Vue.js - Updated",
  "description": "Updated description",
  "questions": [
    {
      "id": "q1",
      "text": "Updated question text",
      "options": [
        { "id": "a", "text": "Option A", "isCorrect": true },
        { "id": "b", "text": "Option B", "isCorrect": false }
      ]
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "id": "quiz_789",
  "title": "Advanced Vue.js - Updated",
  "updatedAt": "2024-01-20T15:30:00Z",
  "message": "Quiz updated successfully"
}
```

**Errors:**
- `400 Bad Request` - Invalid data
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not the quiz owner
- `404 Not Found` - Quiz not found

---

### Delete Quiz

Delete a quiz (requires authentication and ownership or admin).

**Endpoint:** `DELETE /quizzes/:id`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Quiz deleted successfully"
}
```

**Errors:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No permission to delete
- `404 Not Found` - Quiz not found

---

### Submit Quiz Answers

Submit answers for a quiz and get results.

**Endpoint:** `POST /quizzes/:id/submit`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "answers": [
    { "questionId": "q1", "selectedOption": "b" },
    { "questionId": "q2", "selectedOption": "a" },
    { "questionId": "q3", "selectedOption": "c" }
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
  "percentageScore": 80.0,
  "passed": true,
  "results": [
    {
      "questionId": "q1",
      "correct": true,
      "selectedOption": "b",
      "correctOption": "b",
      "points": 10,
      "explanation": "Correct! This is the right answer because..."
    },
    {
      "questionId": "q2",
      "correct": false,
      "selectedOption": "a",
      "correctOption": "c",
      "points": 0,
      "explanation": "The correct answer is C because..."
    }
  ],
  "leaderboardPosition": 15,
  "submittedAt": "2024-01-20T16:00:00Z"
}
```

**Errors:**
- `400 Bad Request` - Invalid answers format
- `401 Unauthorized` - Not authenticated
- `404 Not Found` - Quiz not found

---

## User Management

### Update User Profile

Update user profile information.

**Endpoint:** `PUT /users/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request:**
```json
{
  "nickname": "newnicename",
  "bio": "I love quizzes!",
  "preferences": {
    "emailNotifications": true,
    "publicProfile": true
  }
}
```

**Response (200 OK):**
```json
{
  "id": "user_123",
  "nickname": "newnicename",
  "bio": "I love quizzes!",
  "updatedAt": "2024-01-20T17:00:00Z",
  "message": "Profile updated successfully"
}
```

**Errors:**
- `400 Bad Request` - Invalid data (e.g., nickname taken)
- `401 Unauthorized` - Not authenticated

---

### Get User Statistics

Get detailed statistics for a user.

**Endpoint:** `GET /users/:id/stats`

**Response (200 OK):**
```json
{
  "userId": "user_123",
  "quizzesTaken": 45,
  "quizzesCreated": 12,
  "totalPoints": 3450,
  "averageScore": 82.5,
  "bestScore": 100,
  "worstScore": 45,
  "totalTimeSpent": 18000,
  "streak": {
    "current": 7,
    "longest": 15
  },
  "categoryStats": [
    {
      "category": "Programming",
      "quizzesTaken": 20,
      "averageScore": 88.5
    }
  ],
  "recentActivity": [
    {
      "type": "quiz_completed",
      "quizId": "quiz_123",
      "quizTitle": "JavaScript Basics",
      "score": 90,
      "timestamp": "2024-01-20T12:00:00Z"
    }
  ]
}
```

---

## Ranking System

### Get Global Leaderboard

Get the global ranking of all users.

**Endpoint:** `GET /ranking`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `period` (optional): Time period (all, monthly, weekly, daily)
- `category` (optional): Filter by quiz category

**Response (200 OK):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "nickname": "quizmaster",
      "name": "Jane Doe",
      "picture": "https://example.com/avatar.jpg",
      "totalPoints": 5420,
      "quizzesTaken": 68,
      "averageScore": 91.2,
      "badges": ["top_performer", "consistent_solver"]
    },
    {
      "rank": 2,
      "userId": "user_789",
      "nickname": "brainiac",
      "name": "Bob Smith",
      "totalPoints": 4980,
      "quizzesTaken": 52,
      "averageScore": 89.5,
      "badges": ["fast_solver"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalUsers": 500
  },
  "currentUser": {
    "rank": 15,
    "totalPoints": 3450,
    "percentile": 75.5
  }
}
```

---

### Get Quiz-Specific Leaderboard

Get rankings for a specific quiz.

**Endpoint:** `GET /quizzes/:id/leaderboard`

**Query Parameters:**
- `limit` (optional): Number of top scores (default: 10)

**Response (200 OK):**
```json
{
  "quizId": "quiz_123",
  "quizTitle": "JavaScript Basics",
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_456",
      "nickname": "quizmaster",
      "score": 100,
      "timeSpent": 120,
      "completedAt": "2024-01-15T14:30:00Z"
    }
  ],
  "totalAttempts": 245
}
```

---

## Error Handling

### Standard Error Response

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Specific field error (optional)"
    },
    "timestamp": "2024-01-20T18:00:00Z",
    "path": "/api/quizzes/123"
  }
}
```

### HTTP Status Codes

| Status Code | Meaning | Description |
|-------------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Authenticated but no permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Server temporarily unavailable |

### Common Error Codes

```javascript
// Authentication Errors
AUTH_001: "Invalid credentials"
AUTH_002: "Token expired"
AUTH_003: "Token invalid"
AUTH_004: "Insufficient permissions"

// Validation Errors
VAL_001: "Missing required field"
VAL_002: "Invalid field format"
VAL_003: "Field value out of range"

// Resource Errors
RES_001: "Resource not found"
RES_002: "Resource already exists"
RES_003: "Cannot delete resource with dependencies"

// Business Logic Errors
BIZ_001: "Quiz already submitted"
BIZ_002: "Quiz not published"
BIZ_003: "Nickname already taken"
```

---

## Request/Response Examples

### Example: Creating and Submitting a Quiz

#### 1. Create Quiz

```bash
curl -X POST http://localhost:8000/api/quizzes \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Python Basics",
    "description": "Test your Python knowledge",
    "category": "Programming",
    "difficulty": "beginner",
    "questions": [
      {
        "text": "What is Python?",
        "type": "multiple_choice",
        "options": [
          { "text": "A snake", "isCorrect": false },
          { "text": "A programming language", "isCorrect": true },
          { "text": "A framework", "isCorrect": false }
        ],
        "points": 10
      }
    ]
  }'
```

#### 2. Get Quiz Details

```bash
curl -X GET http://localhost:8000/api/quizzes/quiz_123 \
  -H "Authorization: Bearer eyJhbGc..."
```

#### 3. Submit Answers

```bash
curl -X POST http://localhost:8000/api/quizzes/quiz_123/submit \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      { "questionId": "q1", "selectedOption": "b" }
    ],
    "timeSpent": 60
  }'
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | 5 requests | 15 minutes |
| `/auth/refresh` | 10 requests | 5 minutes |
| `/quizzes` (GET) | 100 requests | 1 minute |
| `/quizzes` (POST) | 10 requests | 1 hour |
| `/quizzes/:id/submit` | 1 request | 5 minutes |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642701600
```

---

## Pagination

List endpoints support pagination with consistent parameters:

**Query Parameters:**
- `page`: Page number (starts at 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## API Versioning

Currently using v1 (implicit). Future versions will be specified in the URL:
- Current: `/api/quizzes`
- Future: `/api/v2/quizzes`

---

## Testing

For testing purposes, use the mock API service:

```javascript
import { mockApi } from '@/services/mockApi'

// Enable mock mode
mockApi.enableMock()

// All API calls will now use mock data
const quizzes = await api.get('/quizzes')
```

---

## Support

For API issues or questions:
- Check error messages and codes
- Review this documentation
- Open an issue on GitHub
- Contact the development team

---

**Last Updated:** January 2024  
**API Version:** 1.0
