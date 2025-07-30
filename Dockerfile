# Base image - using a specific Node.js version
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy peer deps flag to handle React 19
RUN npm ci --legacy-peer-deps

# Copy all files
COPY . .

# Build the app with legacy peer deps flag
RUN npm run build --legacy-peer-deps

# Production environment
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
