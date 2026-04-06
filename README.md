# Todo Manager API

Backend API and React frontend built with Node.js and Express for managing todo lists with JWT-based authentication.

> Tip  
> See [DESIGN.md](./DESIGN.md) for architecture notes, authentication design, and testing strategy.

## Project Description

This project is a todo-list application with:

- user signup and login
- JWT authentication
- `bcrypt` password hashing
- refresh token system with `httpOnly` cookie
- protected list and todo operations
- React frontend for task management
- unit, integration, and end-to-end test coverage

## What It Does

- Users can sign up and log in
- Logged-in users can create and manage their own lists
- Only the owner of a list can rename it or add todos
- Todos can be created, completed, filtered, and deleted
- Access tokens are short-lived
- Refresh tokens are rotated and stored in `httpOnly` cookies

## Prerequisites

Before running the project, install:

- [Node.js](https://nodejs.org/) 18+ recommended
- npm 9+ recommended

Optional for API testing:

- Postman or Thunder Client

## Install & Setup

```bash
npm install
```

## Run The Project

Run backend and frontend together:

```bash
npm run dev
```

Frontend:

- [http://localhost:5173](http://localhost:5173)

Backend API:

- [http://localhost:3000](http://localhost:3000)

Production frontend build:

```bash
npm run build
npm start
```

## Authentication

This project uses:

- `bcryptjs` for password hashing
- JWT access tokens for protected requests
- refresh token rotation using `httpOnly` cookie

### Auth Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

## Main Features

### Lists

- create list
- rename list
- fetch only the logged-in user's lists

### Todos

- add todo to a list
- update completion status
- delete todo

## API Notes

Protected endpoints require authentication.

Main protected routes:

- `GET /lists`
- `POST /lists`
- `PATCH /lists/:id`
- `POST /lists/:id/todos`
- `PATCH /lists/:id/todos/:todoId`
- `DELETE /lists/:id/todos/:todoId`

## Testing

Run all Jest tests:

```bash
npm test
```

Run API integration tests only:

```bash
npm run test:api
```

Run Playwright end-to-end tests:

```bash
npm run test:e2e
```

Open the Playwright HTML report:

```bash
npm run test:e2e:report
```

## Test Coverage In This Project

- Jest unit tests for service logic
- Supertest integration tests for API routes
- Playwright end-to-end tests for UI flows

## Manual Testing

You can also test the API manually using Postman or Thunder Client at:

- [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Node.js
- Express
- React
- Vite
- JWT
- bcryptjs
- Jest
- Supertest
- Playwright

## Project Structure

```text
expresslist/
  config/
  controller/
  middleware/
  models/
  routes/
  service/
  __tests__/
client/
  src/
playwright/
  tests/
```

## Notes

- Data is currently stored in memory
- Refresh tokens are stored as hashed values in memory per user
- For production, replace in-memory storage with a database and move secrets into environment variables
