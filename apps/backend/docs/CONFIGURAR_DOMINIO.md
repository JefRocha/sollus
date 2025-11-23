# 🌐 Configurando Domínio e HTTPS (SSL)

Como seu servidor é Linux, a melhor solução é usar o **Nginx Proxy Manager** (que já adicionei ao seu `docker-compose.yml`). Ele vai receber as conexões do seu domínio e passar para o backend.

---

## Passo 1: Atualizar o Portainer
1.  Faça o **git push** das alterações do `docker-compose.yml`.
2.  No Portainer, atualize a Stack (botão **Update the stack**).
3.  Aguarde o novo serviço `nginx-proxy` subir.

---

## Passo 2: Acessar o Painel de Gerenciamento
1.  Abra seu navegador em: `http://IP-DO-SEU-SERVIDOR:81`
2.  **Login Padrão:**
    *   Email: `admin@example.com`
    *   Senha: `changeme`
3.  Logo no primeiro acesso, ele pedirá para você mudar o email e a senha. **Faça isso!**

---

## Passo 3: Configurar o Domínio (Proxy Host)
1.  No painel do Nginx Proxy Manager, clique em **Hosts** > **Proxy Hosts**.
2.  Clique em **Add Proxy Host**.
3.  Preencha os dados:
    *   **Domain Names:** `sollus.sollucoesemgestao.com.br` (e outros se tiver).
    *   **Scheme:** `http`
    *   **Forward Hostname / IP:** `sollus-backend` (Use EXATAMENTE esse nome, é o nome do serviço no Docker).
    *   **Forward Port:** `3000`
    *   **Cache Assets:** Pode marcar.
    *   **Block Common Exploits:** Marque (segurança extra).
    *   **Websockets Support:** Marque (importante para o NestJS).

---

## Passo 4: Ativar HTTPS (Cadeado 🔒)
1.  Ainda na mesma tela, vá na aba **SSL**.
2.  **SSL Certificate:** Selecione "Request a new SSL Certificate".
3.  **Force SSL:** Marque (obriga todos a usarem HTTPS).
4.  **HTTP/2 Support:** Marque.
5.  **Email Address:** Coloque seu email real.
6.  **I Agree to the Let's Encrypt Terms:** Marque.
7.  Clique em **Save**.

🎉 **Pronto!**
Agora você pode acessar `https://sollus.sollucoesemgestao.com.br` e ele vai abrir sua aplicação com segurança total.

---

## ⚠️ Importante: DNS
Para isso funcionar, você precisa ir onde comprou seu domínio (Registro.br, GoDaddy, etc.) e criar um registro do tipo **A**:
*   **Nome:** `sollus`
*   **Destino/IP:** O IP Público do seu servidor Linux.
