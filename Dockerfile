# Step 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Step 2: Serve the static build with NGINX
FROM nginx:alpine
COPY --from=builder /app/www /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]