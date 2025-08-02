# Telemedicine Backend API

Node.js/Express backend for telemedicine platform with MongoDB and Socket.io.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB locally or update MONGODB_URI in .env

3. Run the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Doctor login
- `POST /api/auth/logout` - Doctor logout
- `PATCH /api/auth/availability` - Toggle doctor availability

### Devices
- `POST /api/devices/register` - Register pharmacy device
- `GET /api/devices` - Get all devices
- `PATCH /api/devices/:deviceId/ping` - Update device ping

### Sessions
- `POST /api/sessions/initiate` - Initiate patient session
- `GET /api/sessions` - Get all sessions
- `PATCH /api/sessions/:sessionId/status` - Update session status

### Admin
- `GET /api/admin/dashboard` - Get dashboard data
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/seed` - Create sample data

## Sample Requests

### Register Device
```json
POST /api/devices/register
{
  "deviceId": "DEVICE_001",
  "pharmacyName": "City Pharmacy",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "New York, NY"
}
```

### Doctor Login
```json
POST /api/auth/login
{
  "email": "john@telemedicine.com",
  "password": "password123"
}
```

### Initiate Session
```json
POST /api/sessions/initiate
{
  "deviceId": "DEVICE_001",
  "patientName": "John Doe",
  "patientAge": 35,
  "symptoms": "Fever and headache"
}
```

## WebSocket Events
- `doctor-status-change` - Doctor availability changed
- `session-update` - Session status updated