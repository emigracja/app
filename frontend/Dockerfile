# ---- Stage 1: Build the application ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies and build the app
RUN npm install
COPY . .
RUN npm run build

# ---- Stage 2: Run the application ----
FROM node:22-alpine AS runner

WORKDIR /app

# copy required files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]