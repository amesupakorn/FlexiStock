# Stage 1: Build
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build arguments for environment variables
# These will be baked into the static assets by Vite
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_MAPS_API_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run defaults to port 8080
EXPOSE 8080

# Use a script to replace the port in nginx config if needed, 
# but for Cloud Run, we can just hardcode 8080 in nginx.conf or use a template.
CMD ["nginx", "-g", "daemon off;"]
