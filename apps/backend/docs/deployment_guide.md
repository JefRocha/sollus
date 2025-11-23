# Guia de Deploy - Windows Server VPS

Este guia descreve o passo a passo para implantar o backend `fenix-nest` em um servidor Windows (VPS).

## 1. Pré-requisitos no Servidor (VPS)

Acesse sua VPS via Remote Desktop (RDP) e instale os seguintes softwares:

1.  **Node.js (LTS)**:
    *   Baixe e instale a versão LTS mais recente (ex: v20.x ou v22.x) do site oficial: [nodejs.org](https://nodejs.org/).
    *   Verifique a instalação no PowerShell: `node -v` e `npm -v`.
2.  **PostgreSQL** (se o banco for local):
    *   Instale o PostgreSQL para Windows.
    *   Crie o banco de dados `solluserp` (ou o nome definido no seu `.env`).
3.  **PM2 (Gerenciador de Processos)**:
    *   Abra o PowerShell como Administrador e execute:
        ```powershell
        npm install -g pm2 pnpm
        ```
    *   Instale o suporte para rodar como serviço do Windows (para iniciar com o sistema):
        ```powershell
        npm install -g pm2-windows-startup
        pm2-startup install
        ```

## 2. Preparação dos Arquivos

No seu computador local (onde você fez o build):

1.  Certifique-se de que a pasta `dist` foi gerada (`pnpm build`).
2.  Você precisará copiar os seguintes arquivos/pastas para o servidor (pode usar FTP, SCP, ou copiar e colar via RDP se permitido):
    *   Pasta `dist`
    *   Arquivo `package.json`
    *   Arquivo `pnpm-lock.yaml`
    *   Arquivo `.env` (crie um novo baseado no `.env.example` se necessário)
    *   Pasta `scripts` (opcional, útil para verificação)

**Sugestão de Estrutura no Servidor:**
Crie uma pasta, ex: `C:\Sollus\Backend`.

## 3. Instalação das Dependências

No servidor, abra o PowerShell na pasta onde copiou os arquivos (`C:\Sollus\Backend`):

1.  Instale as dependências de produção:
    ```powershell
    pnpm install --prod
    ```
    *Isso vai criar a pasta `node_modules` apenas com o necessário para rodar o sistema.*

## 4. Configuração do Ambiente

1.  Abra o arquivo `.env` no servidor.
2.  Ajuste as variáveis para o ambiente de produção:
    ```ini
    DB_HOST=localhost  # ou IP do banco se for externo
    DB_PORT=5432
    DB_USERNAME=seu_usuario_postgres
    DB_PASSWORD=sua_senha_postgres
    DB_DATABASE=solluserp
    PORT=3000
    # ... outras variáveis
    ```

## 5. Executando a Aplicação

Ainda no PowerShell (na pasta do projeto):

1.  **Teste inicial** (opcional, para ver se não há erros):
    ```powershell
    node dist/main
    ```
    *Se aparecer "Nest application successfully started", dê Ctrl+C para parar.*

2.  **Iniciar com PM2**:
    ```powershell
    pm2 start dist/main.js --name "sollus-backend"
    ```

3.  **Salvar para reiniciar com o Windows**:
    ```powershell
    pm2 save
    ```
    *Como instalamos o `pm2-windows-startup` no passo 1, isso garante que o serviço suba automaticamente se o servidor reiniciar.*

## 6. Configuração de Firewall

Se você precisa acessar essa API de fora da VPS (ex: do frontend hospedado em outro lugar ou App Mobile):

1.  Abra o menu Iniciar -> **Windows Defender Firewall with Advanced Security**.
2.  Clique em **Inbound Rules** (Regras de Entrada) -> **New Rule**.
3.  Selecione **Port** -> **TCP**.
4.  Em **Specific local ports**, digite a porta da aplicação (ex: `3000`).
5.  Selecione **Allow the connection**.
6.  Marque Domain, Private, Public (conforme sua necessidade de segurança).
7.  Dê um nome, ex: "Sollus Backend API".

## 7. Comandos Úteis (Manutenção)

*   **Ver logs**: `pm2 logs sollus-backend`
*   **Reiniciar**: `pm2 restart sollus-backend`
*   **Parar**: `pm2 stop sollus-backend`
*   **Monitorar**: `pm2 monit`
