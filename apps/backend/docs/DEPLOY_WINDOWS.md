# 🚀 Guia de Deploy - Windows Server

Este guia descreve o passo a passo para colocar o **SollusERP (Backend)** em produção utilizando um servidor **Windows Server**.

---

## 1. Pré-requisitos

No servidor Windows, instale os seguintes softwares:

1.  **Node.js (LTS)**
    *   Baixe e instale a versão LTS (v18 ou v20) em: [nodejs.org](https://nodejs.org/)
    *   Durante a instalação, marque a opção para instalar ferramentas nativas (Chocolatey) se possível, mas não é estritamente necessário.
2.  **PostgreSQL (v14 ou superior)**
    *   Baixe e instale: [postgresql.org](https://www.postgresql.org/download/windows/)
    *   Anote a senha do usuário `postgres` definida na instalação.
3.  **Git (Opcional)**
    *   Útil para clonar o repositório diretamente: [git-scm.com](https://git-scm.com/)
    *   Caso não instale, você precisará copiar os arquivos via FTP/Rede.
4.  **PM2 (Gerenciador de Processos)**
    *   Abra o PowerShell como Administrador e execute:
        ```powershell
        npm install pm2 -g
        npm install pm2-windows-startup -g
        pm2-startup install
        ```
    *   Isso garante que o sistema reinicie automaticamente se o servidor reiniciar.

---

## 2. Configuração do Banco de Dados

1.  Abra o **pgAdmin** (instalado junto com o Postgres) ou use o terminal.
2.  Crie o banco de dados `solluserp`:
    ```sql
    CREATE DATABASE solluserp;
    ```
3.  **Importante:** Se você tiver um backup ou script SQL, restaure-o agora.
    *   Se for usar o script do projeto:
        1.  Copie o arquivo `Script_Dados_Postgresql.sql` para o servidor.
        2.  Rode o script de importação (você pode precisar ajustar o `orm.config.ts` para apontar para o banco local do servidor).

---

## 3. Instalação da Aplicação

1.  Crie uma pasta para o projeto, ex: `C:\SollusERP\backend`.
2.  Copie todos os arquivos do projeto para esta pasta (exceto `node_modules` e `dist`).
3.  Abra o PowerShell na pasta do projeto.
4.  Instale as dependências:
    ```powershell
    npm install --legacy-peer-deps
    ```
    *(Use `--legacy-peer-deps` se houver conflitos de versão, ou use `pnpm` se preferir instalar o pnpm globalmente).*

5.  Crie o arquivo `.env` de produção:
    *   Copie o `.env.example` para `.env`.
    *   Edite as variáveis:
        ```ini
        DB_HOST=localhost
        DB_PORT=5432
        DB_USERNAME=postgres
        DB_PASSWORD=SUA_SENHA_AQUI
        DB_DATABASE=solluserp
        PORT=3000
        ```

6.  Compile o projeto:
    ```powershell
    npm run build
    ```
    *Isso criará a pasta `dist`.*

---

## 4. Executando com PM2 (Serviço Windows)

Para que o sistema rode em segundo plano e inicie com o Windows:

1.  No PowerShell (na pasta do projeto), inicie a aplicação:
    ```powershell
    pm2 start dist/main.js --name sollus-backend
    ```
2.  Verifique se está rodando:
    ```powershell
    pm2 list
    ```
    *(Status deve estar `online`).*
3.  Salve a lista de processos para reiniciar automaticamente:
    ```powershell
    pm2 save
    ```

---

## 5. Liberando o Firewall

Se você precisar acessar a API de outros computadores na rede:

1.  Abra o menu Iniciar e digite **"Firewall do Windows com Segurança Avançada"**.
2.  Clique em **Regras de Entrada** > **Nova Regra**.
3.  Selecione **Porta** > **TCP**.
4.  Em **Portas locais específicas**, digite: `3000`.
5.  Selecione **Permitir a conexão**.
6.  Marque Domínio, Particular e Público (conforme sua necessidade de segurança).
7.  Dê um nome, ex: `SollusERP Backend`.

---

## 6. Testando

Abra o navegador no servidor ou em outra máquina da rede:
*   `http://IP_DO_SERVIDOR:3000`

Se aparecer a mensagem "Hello World" ou similar (dependendo da rota raiz), está funcionando!

---

## 💡 Dicas de Manutenção

*   **Ver logs:** `pm2 logs sollus-backend`
*   **Reiniciar:** `pm2 restart sollus-backend`
*   **Parar:** `pm2 stop sollus-backend`
*   **Atualizar versão:**
    1.  `pm2 stop sollus-backend`
    2.  Copie os novos arquivos.
    3.  `npm install` (se houver novas dependências).
    4.  `npm run build`
    5.  `pm2 restart sollus-backend`
