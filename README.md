# 🔒 SecureNote — Secure Note Taking App Server

SecureNote Backend is a production-ready REST API for a secure note-taking platform. It provides robust authentication, role-based access control, and dedicated modules for notes and posts, enabling users to capture ideas safely while Admins maintain the platform.

---

## 🎯 Project Overview

SecureNote Backend is a robust RESTful API that powers the SecureNote platform, enabling user registration, secure login, note and post management, and role-based access control. It focuses on security, data integrity, and clean business workflows across the user lifecycle — from onboarding and identity management to content creation and admin reporting.

Key capabilities:

- Secure user registration and login with hashed passwords and JWT token issuance
- Session management via HTTP-only cookies with access and refresh tokens
- Full notes lifecycle: create, read, update and delete with strict ownership checks
- Posts module with `$lookup` aggregation to join user data efficiently
- Interest-based user analytics for admins
- Pagination, sorting and metadata on all list endpoints via a reusable QueryBuilder utility
- Role-based access control (RBAC) enforced through centralized middleware

### Supported Roles

- **USER:** Standard consumer account; can register, log in, and manage personal notes and posts.
- **ADMIN:** Platform operator with elevated privileges to create/update/delete users and view all notes across the platform.

---

## 🌐 Live API & Repository

- **Server Live API:**
  https://YOUR-LIVE-URL/

- **Repository:**
  https://github.com/Samira-Shajahan-Borsha/note-taking-app-server

- **Base URL (Local Development):**
  http://localhost:5000/api/v1

---

## 🔑 Test Credentials

### User Accounts

| Role        | Email             | Password       |
| ----------- | ----------------- | -------------- |
| Super Admin | admin@gmail.com   | 12345678@admin |
| User        | samira@gmail.com  | 1234@Samira    |

> **Note:** These are development test credentials. The Super Admin account is auto-seeded on server startup from the `.env` variables `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD`. Never use production credentials in the `.env` file.

---

## 🔐 Authentication, Authorization & Security Highlights

SecureNote secures user access with short-lived access tokens and longer-lived refresh tokens, enforced via middleware and role guards. Authentication is centered on JWTs, while authorization is enforced through explicit role checks.

Key details:

- **Access & Refresh Tokens:** Short-lived JWT access tokens plus refresh tokens allow safe session continuation. The backend exposes a `/auth/refresh-token` endpoint to issue new access tokens.
- **Secure Cookie Storage:** Access and refresh tokens are stored in HTTP-only cookies to reduce the XSS attack surface. Tokens are validated on each protected endpoint.
- **Role-Based Authorization (RBAC):** `checkAuth` middleware verifies the authenticated identity and enforces role requirements (USER, ADMIN) per-route.
- **Password Security:** Passwords are hashed using `bcryptjs` with configurable salt rounds and never returned in responses.
- **Session Management & Logout:** Logout clears the access and refresh token cookies to invalidate the client session.
- **Account Existence Validation:** Every authenticated request re-verifies the user still exists in the database.

Security best practices implemented:

- `httpOnly` cookies with `secure` flag enabled in production
- Token expiration and refresh flows to limit exposure of compromised tokens
- Centralized middleware for authorization and identity checks

---

## 🧠 Core Business Logic

### 1️⃣ User & Profile Management

- Public registration with hashed passwords, plus admin-only user creation
- Admin capabilities: list all users, view a single user, update (name/email/password/role/interests), and delete users
- Interest-based analytics endpoint that groups users by their declared interests for insights
- Endpoints never expose password fields in responses

### 2️⃣ Notes Management

- Authenticated users can create, view, update and delete their own notes
- Ownership enforcement: users can only read/update/delete their own notes, while Admins may view any note
- Pagination and sorting support on the "my notes" and "all notes" endpoints

### 3️⃣ Posts & Content Discovery

- Authenticated users can publish posts
- Posts by a given user are retrieved with `$lookup` aggregation to embed the author's name and email
- Paginated response with total count and total pages metadata

### 4️⃣ Analytics & Reporting

- Admins can view users grouped by interests with member counts — useful for segmentation and reporting

---

## 🧩 API Endpoints Overview

> All endpoints are prefixed with `/api/v1`.

### 🔐 Authentication

| Endpoint              | Method | Access        | Description                |
| --------------------- | ------ | ------------- | -------------------------- |
| `/auth/register`      | POST   | Public        | Register a new user        |
| `/auth/login`         | POST   | Public        | Login & token issuance     |
| `/auth/refresh-token` | POST   | Public        | Get a new access token     |
| `/auth/logout`        | POST   | Authenticated | Invalidate session         |
| `/auth/me`            | GET    | Authenticated | Get current user profile   |

---

### 👤 Users & Admin Controls

| Endpoint                       | Method | Access | Description                    |
| ------------------------------ | ------ | ------ | ------------------------------ |
| `/user/create-user`            | POST   | Admin  | Create a new user              |
| `/user/all-users`              | GET    | Admin  | Get all users (paginated)      |
| `/user/grouped-by-interests`   | GET    | Admin  | Get users grouped by interests |
| `/user/:id`                    | GET    | Admin  | Get a single user              |
| `/user/:id`                    | PATCH  | Admin  | Update a user                  |
| `/user/:id`                    | DELETE | Admin  | Delete a user                  |

---

### 📝 Notes

| Endpoint             | Method | Access        | Description                              |
| -------------------- | ------ | ------------- | ---------------------------------------- |
| `/note/create-note`  | POST   | Authenticated | Create a new note                        |
| `/note/my-notes`     | GET    | Authenticated | Get the authenticated user's notes       |
| `/note/all-notes`    | GET    | Admin         | Get all notes (paginated)                |
| `/note/:id`          | GET    | Authenticated | Get a single note (own or any for Admin) |
| `/note/:id`          | PATCH  | Authenticated | Update a note (owner only)               |
| `/note/:id`          | DELETE | Authenticated | Delete a note (owner only)               |

---

### 📰 Posts

| Endpoint             | Method | Access        | Description                     |
| -------------------- | ------ | ------------- | ------------------------------- |
| `/post/create-post`  | POST   | Authenticated | Create a new post               |
| `/post/user/:userId` | GET    | Authenticated | Get all posts by a specific user |

---

### 📄 Query Parameters (List Endpoints)

List endpoints (`/user/all-users`, `/note/my-notes`, `/note/all-notes`, `/post/user/:userId`) support the following query parameters:

| Parameter | Type   | Default     | Description                         |
| --------- | ------ | ----------- | ----------------------------------- |
| `page`    | number | `1`         | Page number for pagination          |
| `limit`   | number | `10`        | Number of items per page            |
| `sort`    | string | `-createdAt`| Sort field and direction            |

---

## 🛠️ Technology Stack

### 🧠 Core & Runtime

- 🚀 **Node.js:** JavaScript runtime
- 🌐 **Express.js:** HTTP server and REST API routing
- 🧪 **TypeScript:** Static type checking and compilation

### 🗄️ Database & ORM

- 📦 **MongoDB:** NoSQL document database
- 🧾 **Mongoose:** ODM for modeling application data

### 🔐 Authentication & Security

- 🔑 **jsonwebtoken:** JWT access and refresh token handling
- 🛡️ **bcryptjs:** Password hashing and verification
- 🍪 **cookie-parser:** HTTP cookie parsing for token storage

### ✅ Validation & Serialization

- 🧩 **Zod:** Request and payload schema validation

### 🌐 HTTP & Network

- 🌍 **CORS:** Cross-Origin Resource Sharing middleware
- ⚙️ **dotenv:** Environment variable management
- 🧾 **http-status-codes:** HTTP status helpers

### 🛠️ Development Tools

- ⚡ **tsx:** TypeScript watch-mode development server
- 🧹 **ESLint:** Code linting and quality checks
- 🧠 **TypeScript:** Compile-time type safety

### 📦 Type Definitions (Dev Dependencies)

- **@types/cookie-parser**
- **@types/cors**
- **@types/dotenv**
- **@types/express**
- **@types/jsonwebtoken**

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** (local or cloud instance via MongoDB Atlas)
- **Git** for version control

### Clone the Repository

```bash
git clone https://github.com/Samira-Shajahan-Borsha/note-taking-app-server.git
cd note-taking-app-server
```

### Environment Setup

1. **Create the environment file:**

```bash
cp .env.example .env
```

2. **Configure `.env` variables:**

```bash
# Server & Database
PORT=5000
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Password Security
BCRYPT_SALT_ROUND=10

# Super Admin Credentials (auto-seeded on startup)
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=ChangeMe@123

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=1d
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=30d

# Frontend URL (CORS allowlist)
FRONTEND_URL=http://localhost:3000
```

### Install Dependencies

```bash
npm install
```

---

## ▶️ Running the Project

### Development Mode

Start the development server with hot-reload using `tsx`:

```bash
npm run dev
```

The server connects to MongoDB, auto-seeds the Super Admin account, and starts on `http://localhost:5000`. Changes to TypeScript files automatically restart the server.

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

This generates the `dist/` directory with compiled JavaScript.

### Production Mode

Run the compiled production build:

```bash
npm start
```

Ensure `.env` is configured with production values before deployment.

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

---

## 📂 Project Structure

```text
note-taking-app-server/
├── src/
│   ├── app.ts                     # Express app configuration
│   ├── server.ts                  # Server startup entry point
│   └── app/
│       ├── config/
│       │   └── env.ts             # Environment variable validation and loading
│       ├── errorHelpers/
│       │   └── AppError.ts        # Custom error class
│       ├── middlewares/
│       │   ├── checkAuth.ts       # Role-based authorization guard
│       │   ├── globalErrorHandler.ts # Centralized error handling
│       │   ├── notFound.ts        # 404 handler
│       │   └── validateRequest.ts # Request validation with Zod
│       ├── modules/
│       │   ├── auth/              # Registration, login, token refresh, logout, me
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.route.ts
│       │   │   └── auth.service.ts
│       │   ├── user/              # User management and admin controls
│       │   │   ├── user.controller.ts
│       │   │   ├── user.interface.ts
│       │   │   ├── user.model.ts
│       │   │   ├── user.route.ts
│       │   │   ├── user.service.ts
│       │   │   └── user.validation.ts
│       │   ├── note/              # Note CRUD and ownership enforcement
│       │   │   ├── note.controller.ts
│       │   │   ├── note.interface.ts
│       │   │   ├── note.model.ts
│       │   │   ├── note.route.ts
│       │   │   ├── note.service.ts
│       │   │   └── note.validation.ts
│       │   └── post/              # Post creation and retrieval with aggregation
│       │       ├── post.controller.ts
│       │       ├── post.interface.ts
│       │       ├── post.model.ts
│       │       ├── post.route.ts
│       │       ├── post.service.ts
│       │       └── post.validation.ts
│       ├── routes/
│       │   └── index.ts           # Route aggregation and mounting
│       ├── types/
│       │   └── express.d.ts       # Express middleware type extensions
│       └── utils/
│           ├── catchAsync.ts      # Async error wrapper
│           ├── jwt.ts             # JWT token generation and verification
│           ├── password.ts        # Password hashing and verification
│           ├── queryBuilder.ts    # MongoDB query builder utility
│           ├── seedSuperAdmin.ts  # Super admin initialization script
│           ├── sendResponse.ts    # Standardized response formatter
│           ├── setCookie.ts       # Cookie setter utility
│           └── userToken.ts       # User token utilities
├── dist/                          # Compiled JavaScript output (generated)
├── node_modules/                  # Dependencies (installed via npm)
├── .env                           # Environment variables (development)
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── eslint.config.mjs              # ESLint configuration
├── package.json                   # Project dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── tsconfig.json                  # TypeScript configuration
├── README.md                      # This file
└── Secure Note Taking App.postman_collection.json # Postman API collection
```

---

## 🧪 Testing with Postman

An importable Postman collection is included at the repository root:

- **File:** `Secure Note Taking App.postman_collection.json`

Import it into Postman, log in with the test credentials above, and the cookie-based session will be managed automatically for subsequent requests.