# IFCode Server API Documentation

## Overview

This is a comprehensive API documentation for the IFCode Server - a NestJS application with JWT/Google OAuth authentication and MySQL database integration. This documentation is designed to help frontend developers integrate with the server API.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Update with your production URL

## Interactive Documentation

- **Swagger UI**: `http://localhost:3000/api`

## Authentication

The API uses two authentication methods:

### 1. JWT Authentication
- Register/Login endpoints return a JWT token
- Protected endpoints require `Authorization: Bearer <token>` header
- Token expires in 1 day (configurable)

### 2. Google OAuth 2.0
- OAuth flow for Google login
- Returns JWT token upon successful authentication

## Data Models

### User Entity
```typescript
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  googleId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // password field is excluded from responses
}
```

### DTOs (Data Transfer Objects)

#### RegisterDto
```typescript
interface RegisterDto {
  email: string;        // Valid email format
  firstName: string;    // Required
  lastName: string;     // Required
  password: string;     // Minimum 6 characters
}
```

#### LoginDto
```typescript
interface LoginDto {
  email: string;        // Valid email format
  password: string;     // Required
}
```

#### CreateUserDto
```typescript
interface CreateUserDto {
  email: string;        // Valid email format
  firstName: string;    // Required
  lastName: string;     // Required
  password: string;     // Minimum 6 characters
}
```

#### UpdateUserDto
```typescript
interface UpdateUserDto {
  email?: string;       // Optional, valid email format
  firstName?: string;   // Optional
  lastName?: string;    // Optional
  password?: string;    // Optional, minimum 6 characters
  isActive?: boolean;   // Optional
}
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### Google OAuth Login
```http
GET /auth/google
```

**Description:** Redirects to Google OAuth consent page. After user consent, redirects to callback URL.

#### Google OAuth Callback
```http
GET /auth/google/callback?code=<authorization_code>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "googleId": "google_user_id",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Management Endpoints

All user endpoints (except POST /users) require JWT authentication via `Authorization: Bearer <token>` header.

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get All Users (Protected)
```http
GET /users
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get User by ID (Protected)
```http
GET /users/:id
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found",
  "error": "Not Found"
}
```

#### Update User (Protected)
```http
PATCH /users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John Updated",
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John Updated",
  "lastName": "Doe",
  "isActive": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:01.000Z"
}
```

#### Delete User (Protected)
```http
DELETE /users/:id
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data/validation error
- **401 Unauthorized**: Authentication required or invalid token
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation error
- **500 Internal Server Error**: Server error

### Validation Errors (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Authentication Errors (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### Registration
```javascript
const register = async (userData) => {
  try {
    const response = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // Store token for future requests
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Usage
const newUser = {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password123'
};
const result = await register(newUser);
```

#### Login
```javascript
const login = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Usage
const credentials = {
  email: 'user@example.com',
  password: 'password123'
};
const result = await login(credentials);
```

#### Authenticated Requests
```javascript
const getUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};
```

#### Axios Example (Alternative)
```javascript
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage examples
const register = (userData) => api.post('/auth/register', userData);
const login = (credentials) => api.post('/auth/login', credentials);
const getUsers = () => api.get('/users');
const getUser = (id) => api.get(`/users/${id}`);
const updateUser = (id, data) => api.patch(`/users/${id}`, data);
const deleteUser = (id) => api.delete(`/users/${id}`);
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Verify token validity or get user profile
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    if (response.ok) {
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem('token', data.access_token);
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { user, token, login, logout };
};
```

## Google OAuth Integration

For frontend Google OAuth integration, redirect users to:
```
GET http://localhost:3000/auth/google
```

After successful authentication, Google will redirect to your configured callback URL with the JWT token.

## Environment Variables

When deploying your frontend, ensure these environment variables are configured for API communication:

```env
REACT_APP_API_BASE_URL=http://localhost:3000
# or for production:
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

## CORS Configuration

The server is configured with CORS enabled, allowing cross-origin requests from any domain. In production, you may want to restrict this to specific domains.

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production use.

## Security Considerations

1. **JWT Token Storage**: Store JWT tokens securely (consider httpOnly cookies for web apps)
2. **HTTPS**: Use HTTPS in production
3. **Token Expiration**: Handle token expiration gracefully in your frontend
4. **Input Validation**: The server validates all inputs, but add client-side validation for better UX
5. **Error Handling**: Implement proper error handling for network failures and API errors

## Testing the API

### Using curl

```bash
# Register user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","lastName":"User","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get users (replace TOKEN with actual token)
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman

1. Create a new collection for "IFCode API"
2. Add environment variables for `base_url` and `token`
3. Create requests for each endpoint
4. Use collection variables for authentication

## Swagger Documentation

Visit `http://localhost:3000/api` for interactive API documentation where you can:
- View all endpoints and their specifications
- Test endpoints directly from the browser
- See request/response schemas
- Authenticate and test protected endpoints

This interactive documentation is automatically generated and always up-to-date with the current API implementation.