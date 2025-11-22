# Node Auth Server

A secure authentication server built with Node.js, Express, TypeScript, PostgreSQL, and Redis. Features session-based authentication with Passport.js and password hashing with Argon2.

## Features

- 🔐 Secure password hashing with Argon2
- 🎫 Session-based authentication using Passport.js
- 💾 Flexible session storage (PostgreSQL or Redis)
- 🐘 PostgreSQL database with migrations
- 🔒 TypeScript for type safety
- 🐳 Docker Compose for easy development setup

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Redis (optional, for session storage)
- npm

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd node-auth-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set your values:

- Generate a secure `SESSION_SECRET`: `openssl rand -base64 32`
- Configure PostgreSQL credentials
- (Optional) Configure Redis connection

### 4. Start the database

Using Docker Compose:

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers.

### 5. Run database migrations

```bash
npx node-pg-migrate up
```

### 6. Start the development server

```bash
npm run dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

## Development

### Build

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Run in production mode

```bash
npm start
```

### Linting

```bash
npm run lint
# or
npx eslint . --ext .ts
```

## API Endpoints

### Authentication

#### Register a new user

```http
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "username": "johndoe"
}
```

#### Login

```http
POST /login
Content-Type: application/x-www-form-urlencoded

username=johndoe&password=securepassword123
```

**Response:** `302 Found` (redirects to `/` on success)

#### Logout

```http
GET /logout
```

**Response:** `302 Found` (redirects to `/`)

### User

#### Get current user

```http
GET /me
```

**Response:** `200 OK`

```json
{
  "id": "uuid"
}
```

**Response:** `401 Unauthorized` (if not authenticated)

```json
{
  "message": "authentication required"
}
```

## Database Schema

### Users Table

```sql
- id: UUID (primary key)
- username: VARCHAR(24) (unique)
- password_hash: TEXT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

Username requirements:

- 2-24 characters
- Must start with a letter
- Can contain letters, numbers, and underscores
- No consecutive underscores

### Sessions Table

Used by `connect-pg-simple` for session storage when Redis is not configured.

## Environment Variables

| Variable            | Required | Default            | Description                     |
| ------------------- | -------- | ------------------ | ------------------------------- |
| `PORT`              | No       | `3000`             | Server port                     |
| `NODE_ENV`          | No       | `development`      | Environment mode                |
| `SESSION_SECRET`    | **Yes**  | -                  | Secret for session encryption   |
| `POSTGRES_DB`       | No       | `node-auth-server` | PostgreSQL database name        |
| `POSTGRES_HOST`     | No       | `localhost`        | PostgreSQL host                 |
| `POSTGRES_PORT`     | No       | `5432`             | PostgreSQL port                 |
| `POSTGRES_USER`     | No       | `postgres`         | PostgreSQL username             |
| `POSTGRES_PASSWORD` | No       | `password`         | PostgreSQL password             |
| `REDIS_URL`         | No       | -                  | Redis connection URL (optional) |
| `REDIS_PASSWORD`    | No       | -                  | Redis password (if required)    |

## Session Storage

The server supports two session storage backends:

1. **Redis** (recommended for production): Set `REDIS_URL` in your environment
2. **PostgreSQL** (fallback): Used automatically if `REDIS_URL` is not set

## Security Features

- ✅ Argon2 password hashing (winner of Password Hashing Competition)
- ✅ Secure session management with httpOnly cookies
- ✅ Session rotation on login
- ✅ SameSite cookie protection (lax mode for OAuth compatibility)
- ✅ Input validation with regex patterns
- ✅ TypeScript for type safety

## Project Structure

```
.
├── migrations/           # Database migrations
│   ├── 1675948786208_setup.sql
│   ├── 1675950286521_users.sql
│   └── 1675952829746_sessions.sql
├── src/
│   ├── error.ts         # Custom error classes
│   ├── index.ts         # Application entry point
│   ├── middleware/      # Express middleware
│   │   ├── install-passport.ts
│   │   ├── install-postgres.ts
│   │   └── install-session.ts
│   ├── routes/          # API routes
│   │   ├── login-routes.ts
│   │   ├── registration-routes.ts
│   │   └── user-routes.ts
│   ├── services/        # Business logic
│   │   ├── login-service.ts
│   │   └── registration-service.ts
│   └── types/           # TypeScript types
│       └── user.ts
├── docker-compose.yml   # Docker services
├── package.json
└── tsconfig.json
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Passport.js** - Authentication middleware
- **Argon2** - Password hashing
- **PostgreSQL** - Primary database
- **Redis** - Session storage (optional)
- **node-pg-migrate** - Database migrations
- **ESLint** - Code linting

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
