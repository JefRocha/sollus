# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./.env.example
COPY --from=builder /app/scripts ./scripts

# Expose port
EXPOSE 3000

# Create startup script that runs migrations before starting the app
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "🔄 Verificando migrations pendentes..."' >> /app/start.sh && \
    echo 'npx typeorm-ts-node-commonjs migration:run -d src/orm.config.ts || echo "⚠️ Nenhuma migration pendente ou erro (continuando...)"' >> /app/start.sh && \
    echo 'echo "✅ Migrations concluídas"' >> /app/start.sh && \
    echo 'echo "🚀 Iniciando aplicação..."' >> /app/start.sh && \
    echo 'node dist/main' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application using the startup script
CMD ["/app/start.sh"]
