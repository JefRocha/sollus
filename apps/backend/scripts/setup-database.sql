-- =====================================================
-- Script de Setup do Banco de Dados PostgreSQL
-- Projeto: Sollus Multitenant
-- =====================================================

-- 1. Criar banco de dados (executar como superusuário postgres)
-- Conectar primeiro ao banco 'postgres' padrão
-- psql -U postgres

CREATE DATABASE solluserp
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Portuguese_Brazil.1252'
    LC_CTYPE = 'Portuguese_Brazil.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE solluserp IS 'Banco de dados do sistema Sollus - Multitenant';

-- 2. Conectar ao banco criado
-- \c solluserp

-- 3. Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para buscas full-text

-- 4. Criar schema de auditoria (opcional, para futuro)
CREATE SCHEMA IF NOT EXISTS audit;

-- 5. Verificar configuração
SELECT 
    current_database() as database_name,
    current_user as connected_user,
    version() as postgres_version;

-- =====================================================
-- Próximos passos:
-- 1. Executar migrations do TypeORM
-- 2. Popular dados de teste (empresas)
-- 3. Validar estrutura
-- =====================================================
