# TelePharma Docker Deployment

## Quick Start

1. **Clone and navigate to project:**
   ```bash
   cd TelePharma
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Services

- **Backend**: Node.js/Express API server
- **Frontend**: Next.js React application

## Environment Variables

All environment variables are configured in `docker-compose.yml`:
- MongoDB connection (cloud database)
- Firebase configuration
- JWT secrets

## Development Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild services
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Volumes

- Source code is mounted for hot reloading
- Node modules are cached in anonymous volumes
- Next.js build cache is preserved

## Ports

- Frontend: 3000
- Backend: 5000

## Notes

- Uses existing cloud MongoDB (no local database needed)
- Firebase credentials included in environment
- Hot reloading enabled for development