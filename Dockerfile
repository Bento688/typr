# Use Node v20
FROM node:20-alpine

# Set working directory to the container root
WORKDIR /app

# --- 1. BUILD FRONTEND ---
# Copy frontend package files and install dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy all frontend source code and build it
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# --- 2. SETUP BACKEND ---
# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all backend source code
COPY backend/ ./backend/

# --- 3. FINALIZE ---
# Cloud Run starts the app from the backend folder
WORKDIR /app/backend

# Expose the port (Cloud Run defaults to 8080)
EXPOSE 8080

# Set production mode so your index.js serves the static files
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]