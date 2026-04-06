# Design Document

## Overview

`todo-list-jwt` is a full-stack todo application with:

- Express backend API
- React frontend
- JWT authentication
- `bcrypt` password hashing
- refresh token rotation with `httpOnly` cookie

The project is designed as a learning-friendly, modular application with clear separation between route handling, controller logic, business logic, and UI.

## Goals

- provide secure user authentication
- keep list ownership enforced
- support clean frontend interaction with backend routes
- include automated testing for service, API, and browser flows

## Architecture

### Backend Layers

#### Routes

Located in `expresslist/routes/`

Responsibilities:

- define API endpoints
- connect endpoints to controllers
- apply authentication middleware

#### Controllers

Located in `expresslist/controller/`

Responsibilities:

- receive request data
- call service methods
- format HTTP responses
- manage cookies for auth flow

#### Services

Located in `expresslist/service/`

Responsibilities:

- business logic
- validation
- list and todo ownership rules
- JWT generation
- refresh token rotation

#### Middleware

Located in `expresslist/middleware/`

Responsibilities:

- validate access tokens
- attach decoded user data to the request

#### Models

Located in `expresslist/models/`

Current storage is in-memory:

- `users`
- `lists`
- `todos`

This is suitable for homework/demo use but should be replaced by a database for production.

## Authentication Design

### Password Hashing

Passwords are hashed using `bcryptjs` before storage.

Benefits:

- plain passwords are never stored
- login uses secure hash comparison

### Access Token

- short-lived JWT
- used for authenticated API requests
- stored in cookie named `token`

### Refresh Token

- longer-lived JWT
- stored in `httpOnly` cookie named `refreshToken`
- rotated on refresh
- hashed before being stored in memory

### Refresh Token Flow

1. User logs in
2. Server issues:
   - access token
   - refresh token
3. Refresh token is saved as a hash in memory
4. Client sends refresh cookie to `/auth/refresh`
5. Server validates refresh token and rotates it
6. Old refresh token hash is removed
7. New access and refresh tokens are returned

### Logout Flow

1. Client calls `/auth/logout`
2. Server revokes the refresh token
3. Access and refresh cookies are cleared

## Authorization Rules

- Users can only see their own lists
- Users can only rename their own lists
- Users can only add, update, or delete todos inside their own lists

## Frontend Design

The React frontend is built with Vite and focuses on:

- simple login/signup flow
- clean list and task management
- responsive layout
- quick filtering between all, active, and completed tasks
- readable, lightweight UI

### UX Principles

- clear hierarchy
- minimal friction for adding tasks
- visibility of task state
- responsive design for smaller screens
- feedback for auth and actions

## Testing Strategy

### Unit Tests

Tool:

- Jest

Coverage:

- user service logic
- list service logic
- validation rules
- auth token refresh behavior

### Integration Tests

Tools:

- Jest
- Supertest

Coverage:

- signup/login flow
- protected routes
- list/todo lifecycle
- refresh token route
- logout route

### End-to-End Tests

Tool:

- Playwright

Coverage:

- UI signup/login
- create list and add todo
- complete and filter todo
- logout flow

Artifacts:

- HTML report
- video recording
- failure screenshots

## Current Limitations

- data is not persistent
- tokens and users are lost when server restarts
- no database yet
- no role system beyond basic user identity

## Recommended Next Steps

- replace in-memory models with a database
- move auth secrets to `.env`
- add token expiration handling in frontend
- add validation library for request payloads
- add refresh-token reuse detection
- add CI pipeline for Jest and Playwright tests

## Summary

This project demonstrates a complete JWT-based todo app with:

- secure password storage
- refresh token support with `httpOnly` cookie
- protected API routes
- React UI
- automated testing across backend and frontend
