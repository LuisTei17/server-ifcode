# API Demo Guide

This guide demonstrates how to use the IFCode Server API endpoints.

## Prerequisites

1. Ensure MySQL is running and the database is created:
```sql
CREATE DATABASE ifcode_db;
```

2. Update the `.env` file with your MySQL credentials

3. Start the application:
```bash
npm run start:dev
```

## API Usage Examples

### 1. Health Check
```bash
curl http://localhost:3000
```
Expected response: `"IFCode Server API is running!"`

### 2. User Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 3. User Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get All Users (Protected)
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get User by ID (Protected)
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Update User (Protected)
```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane"
  }'
```

### 7. Delete User (Protected)
```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Google OAuth Authentication
Navigate to: `http://localhost:3000/auth/google`

This will redirect to Google's OAuth consent screen, and after authentication, redirect back to the callback URL with user information and JWT token.

## API Documentation

Visit `http://localhost:3000/api` for interactive Swagger documentation where you can test all endpoints directly from the browser.

## Testing with Different Tools

### Using Postman
1. Import the API endpoints
2. Set up environment variables for base URL and JWT token
3. Test each endpoint with the examples above

### Using Thunder Client (VS Code)
1. Install Thunder Client extension
2. Create requests based on the curl examples above
3. Use collections to organize your requests

### Using HTTPie
```bash
# Install HTTPie: pip install httpie

# Register user
http POST localhost:3000/auth/register email=john@example.com firstName=John lastName=Doe password=password123

# Login
http POST localhost:3000/auth/login email=john@example.com password=password123

# Get users (replace with your token)
http GET localhost:3000/users Authorization:"Bearer YOUR_JWT_TOKEN"
```

## Expected Database Structure

The application will automatically create the following table structure:

```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `googleId` varchar(255) DEFAULT NULL,
  `isActive` tinyint NOT NULL DEFAULT '1',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
);
```