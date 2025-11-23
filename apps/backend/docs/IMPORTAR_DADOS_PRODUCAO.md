# 📦 Importando Dados em Produção

Este guia explica como importar o arquivo `Script_Dados_Postgresql.sql` para o seu banco de dados de produção rodando no Docker.

---

## Pré-requisitos
1.  Você precisa ter o arquivo `Script_Dados_Postgresql.sql` no seu computador.
2.  O sistema deve estar rodando no Portainer.

---

## Passo 1: Copiar o Arquivo para o Container
Como o arquivo SQL é grande, a melhor forma é copiá-lo para dentro do container do Backend e rodar o script de importação lá de dentro.

1.  Acesse o terminal do seu servidor Linux (via SSH ou terminal direto).
2.  Descubra o ID do container do backend:
    ```bash
    docker ps | grep sollus-backend
    ```
    *(Anote o ID, ex: `a1b2c3d4e5f6`)*

3.  Copie o arquivo do seu computador para o servidor (se já não estiver lá).
    *   Se estiver no Windows e o servidor for remoto, use WinSCP ou FileZilla.

4.  Copie do servidor para dentro do container:
    ```bash
    docker cp Script_Dados_Postgresql.sql ID_DO_CONTAINER:/app/scripts/
    ```

---

## Passo 2: Executar a Importação
Agora que o arquivo está lá dentro, vamos rodar o script que preparamos.

1.  Entre no console do container:
    ```bash
    docker exec -it ID_DO_CONTAINER sh
    ```

2.  Já dentro do container, execute o script:
    ```bash
    npx ts-node scripts/import-sql-stream.ts
    ```

3.  **Aguarde!** O script vai:
    *   Conectar no banco.
    *   Desabilitar verificações de segurança temporariamente (para ser rápido).
    *   Importar linha por linha.
    *   Corrigir erros de schema automaticamente.

---

## Método Alternativo: Via Portainer (Console Web)

Se você não tem acesso SSH fácil, pode tentar pelo Portainer:

1.  Vá em **Containers** > Clique no `sollus-backend`.
2.  Clique em **Console** > **Connect**.
3.  Você estará no terminal do container.
4.  O problema aqui é **como colocar o arquivo lá dentro**.
    *   O Portainer permite upload, mas para volumes.
    *   Se você mapeou um volume, pode colocar o arquivo na pasta do volume no servidor host.

**Recomendação:** O Passo 1 (via linha de comando `docker cp`) é o mais garantido para arquivos grandes.
