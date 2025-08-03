# TelePharma - Telemedicine Platform

A revolutionary telemedicine platform connecting patients with doctors through pharmacy devices. No patient registration required - just walk in and consult.

## 🚀 Overview

TelePharma enables remote medical consultations through pharmacy-based devices, providing healthcare access without the need for patient registration. Doctors can manage consultations remotely while pharmacies serve as consultation points.

## 🏗️ Architecture

```
TelePharma/
├── nextjs-frontend/          # React/Next.js frontend application
├── node-express-backend/     # Node.js/Express API server
├── docker-compose.yml        # Docker orchestration
└── TelePharma-API.postman_collection.json  # API testing collection
```

## ✨ Features

### For Doctors
- **Real-time Dashboard** - Manage consultations and availability
- **Session Management** - Accept, conduct, and complete sessions
- **Mobile Responsive** - Works on all devices
- **Push Notifications** - Real-time session alerts

### For Pharmacies
- **Device Registration** - Simple pharmacy device setup
- **Location Tracking** - GPS-based pharmacy mapping
- **Session Initiation** - Start consultations for patients
- **Real-time Monitoring** - Device status tracking

### For Admins
- **Analytics Dashboard** - Platform metrics and charts
- **Doctor Management** - Monitor doctor availability
- **Session Monitoring** - Track all platform sessions
- **Pharmacy Network** - Interactive map of all locations

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Firebase Admin** - Push notifications
- **JWT** - Authentication
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop
- Git

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd TelePharma

# Start with Docker
docker compose up --build

# Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 2: Manual Setup

```bash
# Backend setup
cd node-express-backend
npm install
npm start

# Frontend setup (new terminal)
cd nextjs-frontend
npm install
npm run dev
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://telepharma:54JOsb1qKxeaeBKr@telepharma.dqzjtv7.mongodb.net/telemedicine
JWT_SECRET=telemedicine-jwt-secret-key-2024
FIREBASE_PROJECT_ID=telemedicine-31088
# ... Firebase credentials
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwdp8YC0hg-3hrxRkrcXjGCx517Fq1nW0
# ... Firebase configuration
```

## 📱 User Roles & Access

### Doctors
- **Registration**: `/register` - Create doctor account
- **Login**: `/login` - Access dashboard
- **Dashboard**: `/dashboard` - Manage consultations

### Admins
- **Login**: `/admin/login` - Admin authentication
- **Dashboard**: `/admin/dashboard` - Platform management

### Pharmacies
- **Registration**: `/pharmacy` - Register devices
- **API Access**: Device-based API integration

## 🔗 API Documentation

Import `TelePharma-API.postman_collection.json` into Postman for complete API testing.

### Key Endpoints
- `POST /api/auth/login` - Doctor authentication
- `POST /api/sessions/create` - Start consultation
- `GET /api/admin/stats` - Platform analytics
- `GET /api/admin/pharmacies` - Pharmacy locations

## 🗂️ Project Structure

```
TelePharma/
├── nextjs-frontend/
│   ├── src/app/              # Next.js pages
│   ├── src/components/       # React components
│   └── src/lib/             # Utilities
├── node-express-backend/
│   ├── src/controllers/      # Route handlers
│   ├── src/models/          # Database schemas
│   ├── src/routes/          # API routes
│   └── src/config/          # Configuration
└── docker-compose.yml       # Container orchestration
```

## 🚀 Deployment

### Development
```bash
docker compose up --build
```

### Production
```bash
# Build production images
docker compose -f docker-compose.prod.yml up --build
```

## 🧪 Testing

### API Testing
1. Import Postman collection
2. Set base URL to `http://localhost:5000`
3. Test all endpoints with sample data

### Manual Testing
1. Register as doctor at `/register`
2. Login and toggle availability
3. Test admin panel at `/admin/login`
4. Verify pharmacy map functionality

## 📊 Features Overview

| Feature | Doctor | Admin | Pharmacy |
|---------|--------|-------|----------|
| Dashboard | ✅ | ✅ | - |
| Session Management | ✅ | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ | ✅ |
| Analytics | - | ✅ | - |
| Device Management | - | ✅ | ✅ |
| Location Mapping | - | ✅ | ✅ |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - XSS protection
- **CORS Configuration** - Cross-origin security
- **Input Validation** - Data sanitization
- **Environment Variables** - Secure configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check individual README files in `nextjs-frontend/` and `node-express-backend/`
- Review API documentation in Postman collection
- Ensure all environment variables are properly configured