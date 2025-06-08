# ---- Stage 1: Build the application ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies and build the app
RUN npm install
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]