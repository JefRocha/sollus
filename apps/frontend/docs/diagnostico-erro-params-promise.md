# Diagnóstico de Erro: `params` como Promise em Páginas Dinâmicas do Next.js

Este documento detalha o processo de diagnóstico e a solução para um erro encontrado na busca de dados em páginas de edição (rotas dinâmicas).

## Sintoma do Problema

Ao navegar para uma página de edição (por exemplo, `/cadastros/pessoa/1`), a aplicação falhava em carregar os dados da entidade, resultando em um erro genérico no servidor:

```
Error: Falha ao buscar o dado de Pessoa.
```

## Processo de Investigação

1.  **Análise Inicial:** O erro ocorria durante a renderização no servidor (SSR) em uma página que buscava dados através da função `getPessoaById(id)`.

2.  **Adição de Logs:** Para obter mais detalhes sobre a falha na requisição `fetch`, a função `getPessoaById` no arquivo `pessoa.service.ts` foi modificada temporariamente para capturar e logar o status e o corpo da resposta de erro da API, além de capturar exceções na própria chamada `fetch`.

3.  **Análise dos Logs Detalhados:** Após reiniciar o servidor e reproduzir o erro, os novos logs revelaram duas mensagens cruciais:

    *   **Log do Frontend (Next.js):**
        ```
        Error: Route "/cadastros/pessoa/[id]" used `params.id`. `params` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties.
        ```

    *   **Log da Resposta da API (Backend):**
        ```
        Falha ao buscar pessoa (HTTP error): 400 Bad Request {"trace":"BadRequestException: Invalid param id. Number expected..."}
        ```

## Causa Raiz

A análise dos logs mostrou que a causa raiz era uma mudança no comportamento do Next.js.

1.  O erro do Next.js (`params is a Promise`) indicava que, em páginas de rota dinâmica (ex: `[id]/page.tsx`), o objeto `params` não é mais um objeto simples, mas sim uma **Promise** que resolve para esse objeto.
2.  O código original tentava acessar `params.id` diretamente. Como `params` era uma Promise, `params.id` resultava em `undefined`.
3.  A função `getPessoaById` era então chamada com `Number(undefined)`, que resulta em `NaN`.
4.  Isso gerava uma requisição para a API no formato `GET /pessoa/NaN`.
5.  O backend, esperando um ID numérico, corretamente rejeitava a requisição com um erro `400 Bad Request`, confirmando o `Invalid param id`.

## Solução Aplicada

A solução foi modificar o componente da página dinâmica (`D:\Projetos\NextJS\sollus\apps\frontend\src\app\cadastros\pessoa\[id]\page.tsx`) para aguardar a resolução da Promise `params` antes de acessar suas propriedades.

**Código Antigo:**
```typescript
export default async function PessoaPersistePage({ params }: { params: { id: string } }) {
  const id = params.id;
  // ...
}
```

**Código Corrigido:**
```typescript
export default async function PessoaPersistePage({ params }: { params: { id: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  // ...
}
```

A utilização de `await Promise.resolve(params)` garante que o código espere o objeto `params` estar disponível, seja ele uma Promise ou não, tornando a solução robusta para diferentes versões ou comportamentos do framework.
