# 🚀 Guia de Setup do Banco de Dados - Fase 4

## Pré-requisitos
- ✅ PostgreSQL instalado
- ✅ Código da Fase 3 completado
- ✅ Build bem-sucedido

## Passo 1: Criar o Banco de Dados

### Opção A: Usando pgAdmin (Interface Gráfica)
1. Abra o pgAdmin
2. Conecte ao servidor PostgreSQL local
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `solluserp`
5. Owner: `postgres`
6. Clique em "Save"

### Opção B: Usando psql (Linha de Comando)
```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar banco de dados
CREATE DATABASE solluserp;

# Verificar
\l

# Conectar ao banco criado
\c solluserp

# Sair
\q
```

### Opção C: Executar Script SQL
```bash
# No diretório apps/backend
psql -U postgres -f scripts/setup-database.sql
```

## Passo 2: Configurar Credenciais

O arquivo `.env` já foi criado com as configurações padrão:
```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password  # ⚠️ ALTERE ESTA SENHA!
DB_DATABASE=solluserp
```

**⚠️ IMPORTANTE:** Atualize a senha no `.env` com a senha do seu PostgreSQL!

## Passo 3: Testar Conexão

```bash
# Compilar o script de teste
pnpm build

# Executar teste de conexão
pnpm ts-node scripts/test-connection.ts
```

**Resultado esperado:**
```
🔍 Testando conexão com PostgreSQL...

Configuração:
  Host: localhost
  Port: 5432
  Database: solluserp
  Username: postgres

✅ Conexão estabelecida com sucesso!
📊 PostgreSQL Version: PostgreSQL 15.x...
📋 Nenhuma tabela encontrada (banco vazio)
✅ Teste concluído com sucesso!
```

## Passo 4: Próximos Passos

Após confirmar a conexão, vamos:
1. ✅ Configurar TypeORM migrations
2. ✅ Gerar migration inicial com todas as entidades
3. ✅ Criar migration para adicionar ID_EMPRESA
4. ✅ Executar migrations
5. ✅ Popular dados de teste

## Troubleshooting

### Erro: "password authentication failed"
- Verifique a senha no arquivo `.env`
- Tente resetar a senha do usuário postgres

### Erro: "database does not exist"
- Execute o Passo 1 para criar o banco
- Verifique o nome do banco no `.env`

### Erro: "could not connect to server"
- Verifique se o PostgreSQL está rodando
- Windows: Serviços → PostgreSQL
- Verifique a porta 5432

### Erro: "FATAL: role does not exist"
- Crie o usuário no PostgreSQL
- Ou use o usuário padrão "postgres"

## Comandos Úteis PostgreSQL

```bash
# Ver status do serviço (Windows)
Get-Service -Name postgresql*

# Iniciar serviço (Windows)
Start-Service postgresql-x64-15

# Conectar ao banco
psql -U postgres -d solluserp

# Listar bancos
\l

# Listar tabelas
\dt

# Descrever tabela
\d nome_tabela

# Ver usuários
\du
```

## Próximo Passo

Após confirmar que a conexão está funcionando, me avise para prosseguirmos com a criação das migrations! 🚀
