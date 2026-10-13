# Stage 1: Build React/Vite application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build argument for backend API URL at build time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Stage 2: Serve with lightweight Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default html
RUN rm -rf ./*

# Copy production artifacts
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
