# PRD de Implantação em Produção — Sollus ERP

## Visão Geral
- Objetivo: publicar frontend (Next.js) e backend (NestJS) com autenticação por cookies HttpOnly, CSRF ativo e HTTPS end‑to‑end.
- Escopo: configuração de ambiente, segurança, verificação, e checklist final.

## Pré‑requisitos
- Domínios válidos (ex.: `app.seu-dominio.com` para frontend, `api.seu-dominio.com` para backend).
- Certificados TLS válidos para o backend (chave e cadeia de certificados).
- Banco de dados Postgres acessível e migrado.
- Variáveis de ambiente seguras (sem segredos commitados).

## Backend — Configuração
- Arquivo `.env` (produção):
  - `APP_ORIGIN=https://app.seu-dominio.com` (suporta lista CSV para múltiplas origens)
  - `JWT_SECRET=<segredo forte>`
  - `COOKIE_SECURE=true`
  - `HTTPS_ENABLE=true`
  - `HTTPS_KEY_PATH=/caminho/privkey.pem`
  - `HTTPS_CERT_PATH=/caminho/fullchain.pem`
  - `REFRESH_TOKEN_SALT=<segredo-salt>`
  - Demais: `DB_*` (host, usuário, senha, base)
- Segurança ativa:
  - Cookies: `HttpOnly`, `Secure`, `SameSite='none'`, `path='/'` para `sollus_access_token` e `sollus_refresh_token`.
  - CSRF: `GET /api/csrf` emite cookie `XSRF-TOKEN` e o cliente envia `X-CSRF-Token` em `POST/PUT/PATCH/DELETE` e em `POST /api/auth/refresh`.
  - CORS: `credentials: true`, `allowedHeaders: Content-Type, Authorization, X-CSRF-Token`, `origin` baseado em `APP_ORIGIN`.
  - HTTPS: habilitado via `httpsOptions`; HSTS ativo em produção (Helmet).
  - JWT: segredo lido de `JWT_SECRET` (sem hardcode).
  - Rate Limiting básico: `login` (10/min/IP), `refresh` (30/min/IP).
  - Logout: `POST /api/auth/logout` revoga refresh no servidor e limpa cookies.
  - Refresh Tokens: armazenados como hash `sha256(token + REFRESH_TOKEN_SALT)`.
  - Senhas: migração automática para `scrypt` quando usuário loga com hash legado `md5(login+senha)`.

## Backend — Deploy
- Build: `pnpm build`
- Start (exemplos):
  - Node/PM2: `pm2 start dist/main.js --name sollus-backend`
  - Docker (exemplo genérico): container com `NODE_ENV=production` e montagem dos certificados.
- Health/Verificação:
  - `GET https://api.seu-dominio.com/api/csrf` → 200 e cookie `XSRF-TOKEN`.
  - `POST https://api.seu-dominio.com/api/auth/login` → 200 e `Set-Cookie` dos tokens.
  - `GET https://api.seu-dominio.com/api/auth/me` → 200 autenticado.

## Frontend — Configuração
- Arquivo `.env.local` (produção):
  - `NEXT_PUBLIC_API_URL=https://api.seu-dominio.com`
  - `NEXT_PUBLIC_ENABLE_CSRF=1`
  - `NEXT_PUBLIC_AUTH_COOKIE_ONLY=1` (cliente não usa `localStorage`/Bearer; autentica só por cookies HttpOnly)
- Build e Deploy:
  - Build: `pnpm build`
  - Start: `pnpm start` (Next em modo produção) ou via sua plataforma (Vercel/Docker/Nginx + Next standalone).

## Fluxo de Autenticação
- Login: `POST /api/auth/login` define cookies de access/refresh.
- Carga de usuário: `GET /api/me` (proxy do frontend) consulta o backend com credenciais.
- Refresh: em 401, cliente usa `POST /api/auth/refresh` com `X-CSRF-Token` e reexecuta.
- Logout: `POST /api/auth/logout` + limpeza local de estado.

## Checklist de Segurança
- HTTPS ativo com certificados válidos e HSTS.
- `JWT_SECRET`, `REFRESH_TOKEN_SALT` definidos em ambiente seguro.
- CORS restringindo `origin` aos domínios de produção.
- CSRF ativo e verificado nos métodos mutáveis/refresh.
- Cookies `HttpOnly + Secure + SameSite='none'` para tokens; domínio configurado conforme necessidade.
- Refresh tokens armazenados como hash; senhas migrando para `scrypt`.
- Rate limiting básico em `login/refresh`.
- Logs sem exposição de cookies em produção.

## Testes de Validação (Produção)
- `GET /api/csrf` → 200 + cookie `XSRF-TOKEN`.
- `POST /api/auth/login` → 200 + cookies `sollus_access_token`, `sollus_refresh_token`.
- `GET /api/auth/me` → 200 com usuário (nome/email/papel/admin/roles).
- Seção Financeiro visível para `admin` (administrador = 'S' ou role ADMIN).
- `POST /api/auth/refresh` com `X-CSRF-Token` → 200; `GET /api/auth/me` passa após refresh.
- `POST /api/auth/logout` → 200; cookies limpos; refresh revogado.

## Operação e Observabilidade
- Auditoria (sugerido): logar eventos de `login/refresh/logout` com IP/UA.
- Métricas: contadores de 2xx/4xx/5xx para `auth` e principais endpoints.
- Limites: ajustar buckets de rate limiting conforme necessidade.

## Plano de Rollback
- Manter release anterior disponível.
- Reverter envs e artefatos (segredos, certificados) se necessário.
- Desativar temporariamente `AUTH_COOKIE_ONLY` se algum cliente depender de Bearer.

## Referência de Variáveis
- Backend
  - `APP_ORIGIN`: lista CSV de origens permitidas
  - `JWT_SECRET`: segredo JWT
  - `COOKIE_SECURE`: `true` em produção
  - `HTTPS_ENABLE`: habilita HTTPS
  - `HTTPS_KEY_PATH`/`HTTPS_CERT_PATH`: caminhos dos certificados
  - `REFRESH_TOKEN_SALT`: salt para hash de refresh
  - `DB_*`: configuração de banco
- Frontend
  - `NEXT_PUBLIC_API_URL`: URL do backend
  - `NEXT_PUBLIC_ENABLE_CSRF`: `1` para CSRF ativo
  - `NEXT_PUBLIC_AUTH_COOKIE_ONLY`: `1` para autenticar apenas por cookies

## Comandos Úteis
- Backend: `pnpm build && pnpm start:prod`
- Frontend: `pnpm build && pnpm start`
- PM2: `pm2 restart sollus-backend`, `pm2 logs sollus-backend`

## Observações
- Em staging, use certificados válidos ou AC interna e mantenha `COOKIE_SECURE=true`.
- Evite armazenar tokens em `localStorage` em produção; já mitigado com `AUTH_COOKIE_ONLY`.
