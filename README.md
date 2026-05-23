# MPMS Backend API

Minimal Project Management System — REST API built with Express 5, TypeScript, Prisma 7, and PostgreSQL.

---

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Runtime     | Node.js 20+                               |
| Framework   | Express 5                                 |
| Language    | TypeScript 6 (CommonJS)                   |
| ORM         | Prisma 7 + `@prisma/adapter-pg`           |
| Database    | PostgreSQL 15+                            |
| Auth        | JWT (access + refresh tokens, httpOnly cookies) |
| Validation  | Zod 4                                     |
| File upload | Multer 2                                  |
| Security    | Helmet, CORS, bcrypt                      |

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ (running locally or a hosted instance)
- npm 9+

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mpms"

# JWT
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:3000
```

> **Note:** Prisma 7 reads the database URL from `prisma.config.ts`, not from `schema.prisma`. The config file references `process.env.DATABASE_URL` automatically.

---

## Installation

```bash
cd backend
npm install
```

### Generate Prisma client

```bash
npm run prisma:generate
```

### Run database migrations

```bash
npm run prisma:migrate
```

### Seed the database

```bash
npm run prisma:seed
```

This populates the database with 7 demo users, 5 projects, 3 teams, 6 sprints, 15 tasks (with subtasks), time logs, comments, and activity logs.

**Default credentials after seeding:**

| Role  | Email                    | Password      |
|-------|--------------------------|---------------|
| Admin | alice.admin@mpms.dev     | Admin@123456  |
| Admin | bob.admin@mpms.dev       | Admin@123456  |
| User  | carol@mpms.dev           | User@123456   |
| User  | dave@mpms.dev            | User@123456   |
| User  | eve@mpms.dev             | User@123456   |
| User  | frank@mpms.dev           | User@123456   |
| User  | grace@mpms.dev           | User@123456   |

---

## Running the App

```bash
# Development (hot-reload via nodemon)
npm run dev

# Production build
npm run build
npm start
```

The API is available at `http://localhost:4000` (or the `PORT` you configured).

---

## Available Scripts

| Script                  | Description                                |
|-------------------------|--------------------------------------------|
| `npm run dev`           | Start dev server with hot-reload (nodemon) |
| `npm run build`         | Compile TypeScript to `dist/`              |
| `npm start`             | Run compiled production build              |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate`  | Apply pending migrations (dev)            |
| `npm run prisma:seed`     | Seed the database with demo data          |

---

## API Reference

All endpoints are prefixed with `/api`. Authentication uses httpOnly cookies set on login/register.

### Auth — `/api/auth`

| Method | Path              | Auth | Description                         |
|--------|-------------------|------|-------------------------------------|
| POST   | `/register`       | —    | Create account and receive tokens   |
| POST   | `/login`          | —    | Login and receive tokens            |
| POST   | `/refresh`        | —    | Rotate access + refresh token pair  |
| POST   | `/logout`         | ✓    | Invalidate refresh token            |
| GET    | `/me`             | ✓    | Get current user profile            |

**Password requirements:** minimum 8 characters, at least one uppercase letter, at least one digit.

### Projects — `/api/projects`

| Method | Path               | Auth  | Role  | Description                          |
|--------|--------------------|-------|-------|--------------------------------------|
| GET    | `/`                | ✓     | Any   | List projects (`?myProjects=true` for member-only) |
| POST   | `/`                | ✓     | ADMIN | Create project                       |
| GET    | `/:id`             | ✓     | Any   | Get project with sprints and tasks   |
| PATCH  | `/:id`             | ✓     | ADMIN | Update project                       |
| DELETE | `/:id`             | ✓     | ADMIN | Delete project                       |
| POST   | `/:id/thumbnail`   | ✓     | ADMIN | Upload project thumbnail             |
| GET    | `/:id/members`     | ✓     | Any   | List project members                 |
| POST   | `/:id/members`     | ✓     | ADMIN | Add member to project                |
| DELETE | `/:id/members/:uid`| ✓     | ADMIN | Remove member from project           |

### Sprints — `/api/projects/:projectId/sprints`

| Method | Path         | Auth | Role  | Description             |
|--------|--------------|------|-------|-------------------------|
| GET    | `/`          | ✓    | Any   | List sprints for project|
| POST   | `/`          | ✓    | ADMIN | Create sprint           |
| PATCH  | `/:id`       | ✓    | ADMIN | Update sprint           |
| DELETE | `/:id`       | ✓    | ADMIN | Delete sprint           |
| POST   | `/reorder`   | ✓    | ADMIN | Reorder sprints         |

### Tasks — `/api/tasks`

| Method | Path                        | Auth | Description                              |
|--------|-----------------------------|------|------------------------------------------|
| GET    | `/`                         | ✓    | List tasks (filter: sprintId, assigneeId, status) |
| POST   | `/`                         | ✓    | Create task                              |
| GET    | `/:id`                      | ✓    | Get task detail (comments, activity log) |
| PATCH  | `/:id`                      | ✓    | Update task fields                       |
| PATCH  | `/:id/status`               | ✓    | Update task status (manager gate for DONE) |
| DELETE | `/:id`                      | ✓    | Delete task                              |
| POST   | `/:id/attachments`          | ✓    | Upload attachment (multipart/form-data)  |
| DELETE | `/:id/attachments/:attId`   | ✓    | Delete attachment (owner or ADMIN)       |
| GET    | `/:id/comments`             | ✓    | List comments (threaded)                 |
| POST   | `/:id/comments`             | ✓    | Add comment (supports `parentId` for replies) |
| DELETE | `/:id/comments/:commentId`  | ✓    | Delete comment (owner or ADMIN)          |

### Teams — `/api/teams`

| Method | Path                    | Auth | Role  | Description           |
|--------|-------------------------|------|-------|-----------------------|
| GET    | `/`                     | ✓    | Any   | List teams            |
| POST   | `/`                     | ✓    | ADMIN | Create team           |
| PATCH  | `/:id`                  | ✓    | ADMIN | Update team           |
| DELETE | `/:id`                  | ✓    | ADMIN | Delete team           |
| GET    | `/:id/members`          | ✓    | Any   | List team members     |
| POST   | `/:id/members`          | ✓    | ADMIN | Add team member       |
| PATCH  | `/:id/members/:uid`     | ✓    | ADMIN | Update member role    |
| DELETE | `/:id/members/:uid`     | ✓    | ADMIN | Remove team member    |

### Users — `/api/users`

| Method | Path                    | Auth | Role  | Description                    |
|--------|-------------------------|------|-------|--------------------------------|
| GET    | `/`                     | ✓    | ADMIN | List all users                 |
| POST   | `/`                     | ✓    | ADMIN | Create user with credentials   |
| GET    | `/:id`                  | ✓    | ADMIN | Get user by ID                 |
| PATCH  | `/:id`                  | ✓    | ADMIN | Update user profile            |
| PATCH  | `/:id/password`         | ✓    | ADMIN | Change user password           |
| DELETE | `/:id`                  | ✓    | ADMIN | Deactivate user (soft delete)  |

### Reports — `/api/reports`

| Method | Path | Auth | Role  | Description                                        |
|--------|------|------|-------|----------------------------------------------------|
| GET    | `/`  | ✓    | ADMIN | Summary stats + per-project + per-user breakdowns  |

---

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database models
│   ├── prisma.config.ts     # Prisma 7 config (DB URL, adapter)
│   └── seed.ts              # Demo data seeder
├── src/
│   ├── config/
│   │   ├── db.ts            # PrismaClient singleton
│   │   └── env.ts           # Validated environment variables
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT cookie authentication
│   │   ├── validate.middleware.ts # Zod request validation
│   │   ├── upload.middleware.ts   # Multer file upload
│   │   └── error.middleware.ts    # Global error handler
│   ├── routes/
│   │   ├── auth/            # register, login, refresh, logout
│   │   ├── projects/        # project CRUD + members + thumbnail
│   │   ├── sprints/         # sprint CRUD + reorder
│   │   ├── tasks/           # task CRUD + status + attachments + comments
│   │   ├── teams/           # team CRUD + team members
│   │   ├── users/           # user management + password
│   │   └── reports/         # aggregated stats
│   ├── utils/
│   │   ├── ApiError.ts      # Custom error class
│   │   ├── catchAsync.ts    # Async error wrapper
│   │   └── response.ts      # Unified success response
│   ├── app.ts               # Express app setup
│   └── server.ts            # HTTP server entry point
└── uploads/                 # Stored attachment files (git-ignored)
```

---

## Authorization Model

- **ADMIN** users have full access to all endpoints.
- **USER** (member) accounts can read data, update task status (except marking DONE), add comments, and upload attachments.
- **Marking a task DONE** requires the user to be a system ADMIN, or have TeamMember role `MANAGER`/`ADMIN` for the project's team, or be assigned as project `OWNER`.
- Attachment and comment deletion is restricted to the owner or a system ADMIN.
