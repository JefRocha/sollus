# Guia de Deploy Simplificado - Portainer

Não se preocupe se você não entende de Docker. O Portainer facilita muito.
Pense na **Stack** como uma "receita de bolo". Você dá a receita (o arquivo `docker-compose.yml`) e o Portainer faz o bolo (o sistema rodando).

**Neste guia, a "receita" já inclui o Sistema E o Banco de Dados.** Você não precisa instalar o Postgres separadamente.

## O Caminho Mais Fácil: Usando o GitHub/GitLab

A maneira mais simples de usar Stacks é conectar seu Portainer ao seu repositório de código (onde seu código está salvo, ex: GitHub).

### Passo 1: Preparar o Código
1.  Certifique-se de que os arquivos `Dockerfile` e `docker-compose.yml` que criei estão na raiz do seu projeto.
2.  Envie (Push) essas alterações para o seu repositório remoto (GitHub, GitLab, Bitbucket).

### Passo 2: Criar a Stack no Portainer
1.  Acesse seu Portainer.
2.  Clique no ambiente onde vai instalar (ex: `local`).
3.  No menu à esquerda, clique em **Stacks**.
4.  Clique no botão azul **+ Add stack**.
5.  **Name**: Dê um nome, ex: `sollus-stack`.
6.  **Build method**: Selecione a opção **Repository** (ícone do Git).

### Passo 3: Configurar o Repositório
1.  **Repository URL**: Cole o link do seu repositório (ex: `https://github.com/seu-usuario/sollus.git`).
2.  **Repository reference**: Digite o nome da branch, geralmente `main` ou `master`.
3.  **Compose path**: Deixe como `apps/backend/docker-compose.yml` (já que seu backend está numa subpasta).
4.  **Authentication** (Se o repositório for privado): Ative e coloque seu usuário e token de acesso.

### Passo 4: Variáveis de Ambiente (Opcional)
O arquivo `docker-compose.yml` já tem uma configuração padrão. Se quiser mudar a senha do banco, você pode sobrescrever aqui, mas para começar, pode deixar como está no arquivo.

### Passo 5: Finalizar
1.  Clique em **Deploy the stack**.
2.  O Portainer vai:
    *   Baixar o Postgres e iniciar o banco.
    *   Construir seu Backend e conectar ao banco automaticamente.

---

## Método Alternativo: Upload Manual (Se não usar Git)

Se você não tem o código no GitHub, use o método **Upload**:

1.  Na tela de criar Stack, selecione **Upload**.
2.  Em **Select file**, faça o upload do arquivo `docker-compose.yml`.
3.  **IMPORTANTE**: Para isso funcionar via upload, você precisaria que a imagem do backend já estivesse pronta (Docker Hub). O método do Git é melhor porque ele *constrói* a imagem para você.
