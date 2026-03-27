# Prysmas

REST API server built with Express, Mongoose, Passport JWT, and Webpack.

---

## Requirements

- **Node.js** v20+ (managed via [nvm](https://github.com/nvm-sh/nvm))
- **MongoDB** v4+ running locally on port `27017`
- **npm** v10+

---

## Setup

### 1. Install Node version

```sh
nvm install 20
nvm use 20
```

### 2. Install dependencies

```sh
npm install --legacy-peer-deps
```

### 3. Start MongoDB

```sh
brew services start mongodb-community
# or
mongod --dbpath /usr/local/var/mongodb
```

The `prysmas` database is created automatically on first write — no manual setup needed.

### 4. Start the server

```sh
npm start
```

Webpack bundles the server and nodemon restarts it on changes. The server runs on **http://localhost:3000**.

---

## Configuration

All config lives in `server/src/config/environment/shared.js`.

| Key | Default | Description |
|-----|---------|-------------|
| `paths.db` | `mongodb://localhost:27017/prysmas` | MongoDB connection string |
| `paths.clientHost` | `http://localhost:4200` | Angular client origin (used for CORS) |
| `paths.serverHost` | `http://localhost:3000` | Server base URL |
| `app.port` | `3000` | Server port (override with `PORT` env var) |
| `passportJwtConfig.secretOrKey` | `secret` | JWT signing secret |
| `email.host` | `smtp.gmail.com` | SMTP host for email verification |
| `email.port` | `587` | SMTP port |
| `email.user` | — | SMTP username |
| `email.pass` | — | SMTP password |

---

## Project Structure

```
prysmas/
├── server/
│   ├── dist/               # Webpack output (bundle.js)
│   └── src/
│       ├── index.js        # App entry point
│       ├── routes.js       # Route registration
│       ├── swagger.js      # OpenAPI spec
│       ├── api/
│       │   ├── account/    # Login
│       │   ├── auth/       # Passport strategies (JWT, Facebook, Twitter)
│       │   ├── fotones/    # Fotones resource
│       │   └── user/       # User resource + model
│       ├── config/         # Environment config
│       ├── services/
│       │   └── mail/       # Nodemailer email service
│       └── utils/
├── uploads/                # Multer upload destination
├── webpack.config.js
└── package.json
```

---

## API Docs

Swagger UI is served at **http://localhost:3000/api-docs** when the server is running.

All routes are prefixed with `/api`.

---

## Endpoints

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/login` | None | Login with email and password. Returns a JWT. |
| `POST` | `/api/facebook` | None | Authenticate via Facebook OAuth. |

#### POST `/api/login`

**Request body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "msg": "Login successful",
  "token": "<jwt>"
}
```

---

### User

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/user/signup` | None | Register a new user account |
| `GET` | `/api/user/verify` | None | Verify email address via confirmation hash |
| `GET` | `/api/user/info/:id` | JWT | Get user info by ID |
| `POST` | `/api/user/profile/:id` | JWT | Update profile and upload avatar image |
| `GET` | `/api/user/authentication` | JWT | Check if JWT token is valid |

#### POST `/api/user/signup`

**Request body:**
```json
{
  "user": {
    "name": "Carlos",
    "lastname": "Lopez",
    "email": "carlos@example.com",
    "password": "Password0"
  }
}
```

**Response `200`:**
```json
{ "token": "<jwt>" }
```

#### GET `/api/user/verify`

**Query params:**

| Param | Description |
|-------|-------------|
| `hash` | Confirmation hash sent via email |
| `user` | User email address |

#### GET `/api/user/info/:id`

Requires `Authorization: Bearer <token>` header.

**Response `200`:**
```json
{
  "result": { "user": { ... }, "status": "ok" },
  "msg": "success"
}
```

#### POST `/api/user/profile/:id`

Requires `Authorization: Bearer <token>` header.
Accepts `multipart/form-data` with an optional avatar file upload.

#### GET `/api/user/authentication`

Requires `Authorization: Bearer <token>` header.

**Response `200`:**
```json
{ "status": "ok" }
```

---

### Fotones

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/fotones/show` | JWT | List fotones with optional filters |
| `GET` | `/api/fotones/show/:id` | JWT | Get a single fotone by ID |
| `GET` | `/api/fotones/images` | None | Get images pending conversion |

#### GET `/api/fotones/show`

Requires `Authorization: Bearer <token>` header.

**Query params:**

| Param | Description |
|-------|-------------|
| `q` | Text search query |
| `imgDominantColor` | Filter by dominant color |
| `imgType` | Filter by image type |

**Response `200`:**
```json
{
  "images": [
    { "large": "https://...", "thumbnail": "https://..." }
  ]
}
```

---

## Authentication

Protected endpoints require a JWT passed as a Bearer token:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/login` or `POST /api/user/signup`.

---

## User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | First name |
| `lastname` | String | Yes | Last name |
| `email` | String | Yes | Email address |
| `password` | String | Yes | Stored as PBKDF2 hash |
| `salt` | String | No | Crypto salt |
| `role` | String | No | Defaults to `user` |
| `provider` | String | No | Auth provider, defaults to `user` |
| `active` | Boolean | No | Email verified, defaults to `false` |
| `confirmationHash` | String | No | UUID for email verification |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Build with webpack (watch mode) and start server via nodemon |
| `npm test` | Run mocha tests in watch mode |

---

## yo (Angular Full-Stack)

The `yo/` folder is a separate AngularJS 1.6 full-stack app generated with `generator-angular-fullstack`. It has its own Express server, Webpack 4 build, and Gulp workflow.

### Setup

```sh
cd yo
npm install --legacy-peer-deps
```

> Plain `npm install` will fail with `ERESOLVE` due to old peer dependency constraints. Always use `--legacy-peer-deps`.

### Run

```sh
node server/index.js
```

- **Express server** → `http://localhost:9000`
- **BrowserSync proxy** → `http://localhost:3001` (auto-reloads on changes)
- **BrowserSync UI** → `http://localhost:3003`

### Scripts

| Command | Description |
|---------|-------------|
| `node server/index.js` | Start server + webpack dev middleware |
| `npm test` | Run tests with Gulp + Karma |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 4 |
| Database | MongoDB + Mongoose 5 |
| Auth | Passport.js (JWT, Facebook, Twitter) |
| Bundler | Webpack 3 + Babel |
| File uploads | Multer |
| Email | Nodemailer + Handlebars templates |
| Image processing | Sharp |
| API Docs | Swagger UI + swagger-jsdoc |
