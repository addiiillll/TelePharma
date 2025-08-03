# TelePharma Backend API

Node.js/Express backend for the TelePharma telemedicine platform.

## Features

- **Doctor Authentication** - JWT-based login/logout with availability status
- **Device Management** - Pharmacy device registration and monitoring
- **Session Management** - Real-time consultation session handling
- **Admin Dashboard** - Complete platform monitoring and analytics
- **Firebase Integration** - Push notifications and real-time updates
- **MongoDB Atlas** - Cloud database with proper data modeling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT with HTTP-only cookies
- **Notifications**: Firebase Admin SDK
- **Validation**: Express middleware
- **Security**: CORS, cookie-parser

## Project Structure

```
src/
├── config/          # Database and Firebase configuration
├── controllers/     # Route handlers and business logic
├── middleware/      # Authentication and validation
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── services/        # External service integrations
└── app.js          # Express app configuration
```

## Environment Variables

Create `.env` file with:

```env
PORT=5000
MONGODB_URI=mongodb+srv://telepharma:54JOsb1qKxeaeBKr@telepharma.dqzjtv7.mongodb.net/telemedicine
JWT_SECRET=telemedicine-jwt-secret-key-2024
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=telemedicine-31088
FIREBASE_PRIVATE_KEY_ID=4c23a1483387d2b41d2857094f21cec23e7ab8da
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@telemedicine-31088.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=114521692844910220312
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run with nodemon (if installed)
npm run dev
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Doctor registration
- `POST /login` - Doctor login
- `GET /verify` - Verify JWT token
- `GET /profile` - Get doctor profile
- `POST /toggle-availability` - Toggle doctor availability
- `POST /logout` - Doctor logout

### Devices (`/api/devices`)
- `POST /register` - Register pharmacy device
- `GET /` - Get all devices
- `GET /pharmacy` - Get device by pharmacy name
- `PATCH /:deviceId/ping` - Update device ping

### Sessions (`/api/sessions`)
- `POST /create` - Create consultation session (device)
- `PUT /:sessionId/status` - Update session status
- `GET /doctor` - Get doctor's sessions
- `GET /all` - Get all sessions

### Notifications (`/api/notifications`)
- `GET /doctor` - Get doctor notifications
- `GET /device` - Get device notifications
- `PUT /:id/read` - Mark notification as read

### Admin (`/api/admin`)
- `POST /login` - Admin login
- `POST /logout` - Admin logout
- `GET /profile` - Admin profile
- `GET /stats` - Dashboard statistics
- `GET /doctors` - Get all doctors
- `GET /sessions` - Get all sessions
- `GET /pharmacies` - Get all pharmacies

## Authentication

- **Doctors**: JWT tokens in HTTP-only cookies
- **Devices**: API key in `x-api-key` header
- **Admin**: JWT tokens in HTTP-only cookies

## Database Models

- **Doctor**: User profiles with specialization and availability
- **Device**: Pharmacy device registration and location
- **Session**: Consultation sessions with status tracking
- **Admin**: Administrative user accounts
- **Notification**: Push notification records

## Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:5000
```

## Docker

```bash
# Build image
docker build -t telepharma-backend .

# Run container
docker run -p 5000:5000 telepharma-backend
```

## API Testing

Import `../TelePharma-API.postman_collection.json` into Postman for complete API testing.

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error