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

# Compile scripts
RUN pnpm tsc -p tsconfig.scripts.json

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
    echo '  # Script inline otimizado para verificar contagem' >> /app/start.sh && \
    echo '  node -e "const { Client } = require('\''pg'\''); const client = new Client({ host: process.env.DB_HOST, port: parseInt(process.env.DB_PORT || '\''5432'\''), user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD, database: process.env.DB_DATABASE }); client.connect().then(async () => { try { const res = await client.query('\''SELECT COUNT(*) as count FROM \\\"NCM\\\"'\''); const count = parseInt(res.rows[0].count); process.exit(count > 0 ? 1 : 0); } catch (e) { process.exit(0); } finally { client.end(); } });" && NEEDS_IMPORT=0 || NEEDS_IMPORT=1' >> /app/start.sh && \
    echo '  if [ $NEEDS_IMPORT -eq 1 ]; then' >> /app/start.sh && \
    echo '    echo "📥 Importando dados iniciais..."' >> /app/start.sh && \
    echo '    node dist/scripts/import-sql-stream.js' >> /app/start.sh && \
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

