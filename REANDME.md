# Secure Juice

## Techs

- **Frontend**: React (Vite), React Router
- **Backend**: Node.js (Express), SQLite
- **Session Management**: express-session
- **Security Middleware**: csurf, helmet, CORS
- **Authentication**: Email + Password with bcrypt hashing

---

## Features

### Public
- Browse products
- Register and login


### Authenticated Users
- Browse products and manage cart
- Checkout purchases

### Admins
- Create, update, delete products
- View and delete users (except self)

---

## Security Measures

### Session-based Auth
- Users are authenticated using **express-session**.
- Sessions are stored server-side with a secure session ID sent via cookies.

### CSRF Protection
- **csurf** is used to protect all routes.
- The CSRF token is retrieved via `/api/csrf-token` and sent in headers (`CSRF-Token`) with requests.

### Input Validation
- All inputs are validated
- Invalid inputs return appropriate HTTP 400 responses.

### Password Handling
- Passwords are hashed with **bcrypt** before storage.
- Login uses bcrypt’s `compare()` method to verify credentials.

### Role-based Access Control
- Middleware `requireLogin` ensures that certain routes require a session.
- Middleware `requireAdmin` restricts admin features to users with `role === 'admin'`.

### Secure Headers
- **helmet** sets secure HTTP headers.

### Rate Limiting
- Requests are limited to 200 per 10 minutes by using express-rate-limit, which would be lower on a live app.

### CORS Configuration
- Only allows frontend domain (`http://localhost:5173`) to access the API.
- Uses:
  ```js
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'CSRF-Token']
  })
  ```