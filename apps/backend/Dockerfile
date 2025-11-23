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

# Install production dependencies
RUN pnpm install --prod

# Install ts-node and typescript for running scripts
RUN pnpm add ts-node typescript @types/node

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./.env.example
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts
COPY --from=builder /app/src/migrations ./src/migrations

# Expose port
EXPOSE 3000

# Create startup script that runs migrations and imports data
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'echo "🔄 Verificando migrations pendentes..."' >> /app/start.sh && \
    echo 'npx typeorm migration:run -d src/data-source.ts || echo "⚠️ Nenhuma migration pendente ou erro (continuando...)"' >> /app/start.sh && \
    echo 'echo "✅ Migrations concluídas"' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo '# Verificar se precisa importar dados' >> /app/start.sh && \
    echo 'if [ -f "/app/scripts/Script_Dados_Postgresql.sql" ]; then' >> /app/start.sh && \
    echo '  echo "📦 Verificando se o banco precisa de dados iniciais..."' >> /app/start.sh && \
    echo '  npx ts-node -e "import { DataSource } from '\''typeorm'\''; import * as dotenv from '\''dotenv'\''; dotenv.config(); const ds = new DataSource({ type: '\''postgres'\'', host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT || '\''5432'\''), username: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE }); ds.initialize().then(async () => { const result = await ds.query('\''SELECT COUNT(*) as count FROM \\\"NCM\\\"'\''); const count = parseInt(result[0].count); await ds.destroy(); process.exit(count > 0 ? 1 : 0); });" && NEEDS_IMPORT=0 || NEEDS_IMPORT=1' >> /app/start.sh && \
    echo '  if [ $NEEDS_IMPORT -eq 1 ]; then' >> /app/start.sh && \
    echo '    echo "📥 Importando dados iniciais..."' >> /app/start.sh && \
    echo '    npx ts-node scripts/import-sql-stream.ts' >> /app/start.sh && \
    echo '    echo "✅ Dados importados com sucesso!"' >> /app/start.sh && \
    echo '  else' >> /app/start.sh && \
    echo '    echo "⏭️  Dados já existem, pulando importação"' >> /app/start.sh && \
    echo '  fi' >> /app/start.sh && \
    echo 'else' >> /app/start.sh && \
    echo '  echo "⚠️  Arquivo SQL não encontrado, pulando importação"' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo '' >> /app/start.sh && \
    echo 'echo "🚀 Iniciando aplicação..."' >> /app/start.sh && \
    echo 'node dist/main' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application using the startup script
CMD ["sh", "/app/start.sh"]

