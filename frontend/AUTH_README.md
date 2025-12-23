# JWT Authentication Implementation

## Overview
This frontend application now includes complete JWT-based authentication with signup, login, and protected routes.

## Features Implemented

### 1. **Authentication Service** (`src/services/authService.js`)
- JWT token management
- Axios interceptors for automatic token injection
- Token validation and expiration handling
- Login and Signup API integration
- Error handling

### 2. **Auth Context** (`src/contexts/AuthContext.jsx`)
- Global authentication state management
- React Context API for auth state
- Login, Signup, and Logout methods
- Automatic token persistence

### 3. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
- Route guards for authenticated pages
- Automatic redirect to login for unauthenticated users
- Loading state handling

### 4. **Updated Pages**
- **Login Page**: Integrated with auth service, error handling
- **Signup Page**: Integrated with auth service, validation, error handling
- Both pages show error messages for failed authentication

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

Dependencies installed:
- `axios` - HTTP client for API calls
- `jwt-decode` - JWT token decoding

### 2. Configure Environment Variables
Create a `.env` file in the frontend directory:

```bash
cp .env.example .env
```

Update the API URL in `.env`:
```
VITE_API_URL=http://localhost:8080/api/v1
```

### 3. Backend API Requirements

The frontend expects the following API endpoints:

#### **POST /api/v1/auth/signup**
Request:
```json
{
  "companyName": "string",
  "email": "string",
  "phoneNumber": "string",
  "country": "string",
  "state": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "string",
    "email": "string",
    "companyName": "string"
  }
}
```

#### **POST /api/v1/auth/login**
Request:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "string",
    "email": "string",
    "companyName": "string"
  }
}
```

## Usage

### Using Auth Context in Components

```javascript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is logged in
  if (isAuthenticated) {
    console.log('User:', user);
  }

  // Login
  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
  };
}
```

### Protected Routes

Routes wrapped in `<ProtectedRoute>` require authentication:

```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

## Token Storage

- Tokens are stored in `localStorage`
- Automatically added to all API requests via Axios interceptors
- Token expiration is checked on app load
- Expired tokens trigger automatic logout and redirect to login

## Security Features

1. **JWT Validation**: Tokens are validated on every request
2. **Automatic Token Injection**: Tokens automatically added to request headers
3. **Token Expiration Handling**: Expired tokens trigger logout
4. **Protected Routes**: Unauthenticated users redirected to login
5. **Error Handling**: Clear error messages for authentication failures

## User Flow

### Signup Flow:
1. User fills signup form
2. Verifies phone number (OTP)
3. Submits form
4. API creates account and returns JWT
5. Token stored in localStorage
6. User redirected to login page

### Login Flow:
1. User enters credentials
2. API validates and returns JWT
3. Token stored in localStorage
4. User state updated
5. User redirected to tenant registration page

### Protected Page Access:
1. User tries to access protected route
2. `ProtectedRoute` checks authentication
3. If authenticated: Page loads
4. If not authenticated: Redirect to login

## Error Handling

All authentication errors are caught and displayed to the user:
- Invalid credentials
- Network errors
- Server errors
- Validation errors

## Testing

### Test Credentials (Once Backend is Ready)
Create a test user in your backend and use those credentials.

### OTP Verification (Demo)
Currently using demo OTP: `123456`

## Next Steps

1. **Connect to Backend**: Update `VITE_API_URL` to point to your backend
2. **Test Authentication**: Test signup and login flows
3. **Implement Phone OTP**: Connect phone verification to real OTP service
4. **Add Refresh Tokens**: Implement token refresh mechanism
5. **Add Remember Me**: Persist login across sessions

## Troubleshooting

### "No response from server"
- Check if backend is running
- Verify `VITE_API_URL` in `.env`
- Check CORS settings on backend

### "Token expired"
- User will be automatically logged out
- Implement refresh token mechanism for better UX

### Protected routes not working
- Check if `AuthProvider` wraps the entire app
- Verify token is stored in localStorage
- Check browser console for errors

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Auth state management
├── services/
│   └── authService.js           # API calls and token management
├── components/
│   └── ProtectedRoute.jsx       # Route guard component
├── pages/
│   ├── Login.jsx                # Login page with auth integration
│   └── Signup.jsx               # Signup page with auth integration
└── App.jsx                      # App with AuthProvider wrapper
```

## Dependencies

```json
{
  "axios": "^1.x.x",
  "jwt-decode": "^4.x.x",
  "react-hook-form": "^7.x.x",
  "zod": "^4.x.x"
}
```
