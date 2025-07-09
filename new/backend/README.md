# Concise Resume Craft AI Backend

This is the backend API for the Concise Resume Craft AI project, built with Node.js, Express, MongoDB, and JWT authentication, following the MVC pattern.

## Features
- User authentication (JWT)
- Profile management (CRUD)
- Resume builder (CRUD for resume, education, experience, skills, etc.)
- MongoDB integration

## Project Structure
```
backend/
  app.js
  package.json
  config/
  controllers/
  models/
  routes/
  middlewares/
  .env.example
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your environment variables.
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/profile` - Get user profile (auth required)
- `PUT /api/profile` - Update user profile (auth required)
- `GET /api/resume` - Get user's resume (auth required)
- `POST /api/resume` - Create/update resume (auth required)

---

For more details, see each route/controller file. 