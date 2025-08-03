# TelePharma Frontend

Next.js React frontend for the TelePharma telemedicine platform.

## Features

- **Doctor Dashboard** - Real-time session management and availability control
- **Admin Panel** - Complete platform monitoring with interactive charts
- **Authentication** - Secure login/register with password visibility toggle
- **Responsive Design** - Mobile-first design with dark/light theme support
- **Interactive Maps** - Pharmacy location mapping with Leaflet
- **Real-time Updates** - Live session status and notifications
- **Modern UI** - shadcn/ui components with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Maps**: React Leaflet
- **State Management**: React hooks
- **Authentication**: HTTP-only cookies
- **Theme**: next-themes (dark/light mode)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── admin/          # Admin dashboard pages
│   ├── dashboard/      # Doctor dashboard
│   ├── login/          # Authentication pages
│   └── register/       
├── components/         # Reusable components
│   ├── admin/         # Admin-specific components
│   ├── ui/            # shadcn/ui components
│   └── providers/     # Context providers
├── data/              # Static data and configurations
├── hooks/             # Custom React hooks
└── lib/               # Utilities and API functions
```

## Environment Variables

Create `.env.local` file with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDwdp8YC0hg-3hrxRkrcXjGCx517Fq1nW0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=telemedicine-31088.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=telemedicine-31088
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=telemedicine-31088.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=792144509907
NEXT_PUBLIC_FIREBASE_APP_ID=1:792144509907:web:2632bfae6ae6c50b078d26
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-278E0JEE4L
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFgRm0lhkXu4ODQ9dXuKqdOMSRdV2tT_Yi8CiuedaJAEE28k47Xr58zcXdoEojQKFqDHgPAHTsIs3fvZpI0QJ1w

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Pages & Routes

### Public Routes
- `/` - Landing page with role-based navigation
- `/login` - Doctor login with password toggle
- `/register` - Doctor registration form
- `/pharmacy` - Pharmacy device registration

### Doctor Routes (Protected)
- `/dashboard` - Doctor dashboard with session management

### Admin Routes (Protected)
- `/admin/login` - Admin authentication
- `/admin/dashboard` - Main admin dashboard with charts
- `/admin/dashboard/doctors` - Doctor management
- `/admin/dashboard/sessions` - Session monitoring
- `/admin/dashboard/pharmacies` - Pharmacy management with map

## Key Components

### Authentication
- **Login/Register Forms** - With password visibility toggle
- **Protected Routes** - Automatic redirection based on auth status
- **Theme Toggle** - Simple light/dark mode switch

### Doctor Dashboard
- **Session Management** - Accept/complete consultations
- **Availability Toggle** - Online/offline status control
- **Real-time Updates** - Live session notifications
- **Responsive Design** - Mobile-optimized interface

### Admin Dashboard
- **Interactive Charts** - Sessions, doctors, and pharmacy analytics
- **Data Tables** - Sortable, searchable, paginated lists
- **Pharmacy Map** - Interactive map with location pins
- **Real-time Stats** - Live platform metrics

### UI Components
- **Cards** - Information display containers
- **Tables** - Data presentation with actions
- **Charts** - Interactive area charts with theme support
- **Maps** - Leaflet integration with custom markers
- **Forms** - Validated input forms with error handling

## Styling & Theming

- **Tailwind CSS** - Utility-first styling
- **CSS Variables** - Theme-aware color system
- **Dark/Light Mode** - Automatic theme switching
- **Responsive Design** - Mobile-first breakpoints
- **Component Variants** - Consistent design system

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:3000
```

## Docker

```bash
# Build image
docker build -t telepharma-frontend .

# Run container
docker run -p 3000:3000 telepharma-frontend
```

## API Integration

- **Fetch API** - HTTP client for backend communication
- **Cookie Authentication** - Automatic session management
- **Error Handling** - User-friendly error messages
- **Loading States** - Proper loading indicators

## Features by Role

### Doctors
- Session management dashboard
- Availability status control
- Real-time notifications
- Mobile-responsive interface

### Admins
- Platform analytics and charts
- Doctor and session management
- Pharmacy location mapping
- Real-time monitoring

### Public Users
- Role-based landing page
- Authentication forms
- Pharmacy device registration

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Next.js Optimization** - Automatic code splitting
- **Image Optimization** - Built-in Next.js image handling
- **Static Generation** - Pre-rendered pages where possible
- **Bundle Analysis** - Optimized JavaScript bundles