# Multi-stage build for domain checker app

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app

# Copy backend build and dependencies
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/package.json ./

# Copy frontend build to serve statically
COPY --from=frontend-build /app/frontend/dist ./public

# Create data directory for persistent storage
RUN mkdir -p ./data

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "dist/index.js"]
