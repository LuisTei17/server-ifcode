# IFCode Server

A NestJS server application with authentication (JWT & Google OAuth) and CRUD operations using MySQL database.

## Features

- 🔐 **Authentication**: JWT tokens and Google OAuth 2.0
- 📊 **Database**: MySQL with TypeORM
- 🔄 **CRUD Operations**: Complete user management
- 📝 **API Documentation**: Swagger/OpenAPI
- ✅ **Validation**: Request validation with class-validator
- 🏗️ **Architecture**: Modular NestJS structure

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- Google OAuth credentials (for Google authentication)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd server-ifcode
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=ifcode_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=1d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Application Configuration
PORT=3000
NODE_ENV=development
```

4. Create MySQL database:
```sql
CREATE DATABASE ifcode_db;
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at:
- API: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

### Users (Protected)
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── guards/          # Auth guards
│   ├── strategies/      # Passport strategies
│   └── auth.service.ts
├── database/            # Database configuration
├── users/               # Users module
│   ├── dto/            # Data transfer objects
│   ├── entities/       # TypeORM entities
│   └── users.service.ts
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_HOST` | MySQL host | Yes |
| `DB_PORT` | MySQL port | Yes |
| `DB_USERNAME` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_DATABASE` | MySQL database name | Yes |
| `JWT_SECRET` | JWT secret key | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 1d) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | Yes |
| `PORT` | Application port | No (default: 3000) |
| `NODE_ENV` | Environment | No (default: development) |

## License

This project is licensed under the UNLICENSED License.