# Credenciais de Login - Sollus ERP

## Informações de Acesso

### Frontend
- **URL**: http://localhost:3000/login (ou http://localhost:3001/login)
- **Login**: `1`
- **Senha**: `11`

### Backend
- **URL**: http://localhost:4000
- **Endpoint de Login**: POST http://localhost:4000/login

## Como o Login Funciona

1. O backend usa MD5 para hash da senha
2. A fórmula é: `MD5(login + senha)`
3. Para login "1" e senha "11": `MD5("1" + "11")` = `6512bd43d9caa6e02c990b0a82652dca`

## Testando o Backend Diretamente

```bash
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"login":"1","senha":"11"}'
```

Resposta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Dados no Banco

```sql
-- Verificar usuário
SELECT * FROM "USUARIO" WHERE "LOGIN" = '1';

-- Resultado esperado:
-- id: 1
-- LOGIN: 1
-- SENHA: 6512bd43d9caa6e02c990b0a82652dca
-- ADMINISTRADOR: S
```

## Troubleshooting

### Se o login não funcionar:

1. **Verificar se o backend está rodando**:
   ```bash
   curl http://localhost:4000
   ```

2. **Verificar se o usuário existe no banco**:
   ```sql
   SELECT u.*, c.*, e.* 
   FROM "USUARIO" u
   LEFT JOIN "COLABORADOR" c ON c.id = u."ID_COLABORADOR"
   LEFT JOIN "EMPRESA" e ON e.id = c."ID_EMPRESA"
   WHERE u."LOGIN" = '1';
   ```

3. **Verificar logs do backend**: Olhe o terminal onde o backend está rodando

4. **Verificar logs do frontend**: Abra o DevTools do navegador (F12) e veja a aba Console e Network

## Próximos Passos

Após fazer login com sucesso, você será redirecionado para `/dashboard`.
