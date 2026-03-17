# ==========================================
# Stage 1: Build the React application
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies using clean install for consistency
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code and build for production
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Serve the application with Nginx
# ==========================================
FROM nginx:alpine

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]