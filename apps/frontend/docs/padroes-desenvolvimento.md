# Padrões de Desenvolvimento - Sollus Frontend

Este documento define os padrões e convenções a serem seguidos no desenvolvimento do frontend do projeto Sollus.

## 1. Arquitetura e Estrutura

- **Framework**: Next.js 16 (App Router).
- **Linguagem**: TypeScript (estrito).
- **Gerenciamento de Estado**:
  - Server State: React Query (`@tanstack/react-query`).
  - Client State: React Hooks / Context (apenas quando necessário).
  - URL State: Nuqs (se necessário) ou searchParams.
- **Comunicação com Backend**:
  - Server Actions (`next-safe-action`) para mutações e chamadas seguras.
  - Fetch direto ou Axios (via Server Components) para leitura de dados.
  - **NUNCA** expor credenciais de banco de dados no cliente.

## 2. Estilização e UI

- **CSS**: Tailwind CSS v4.
- **Componentes**: shadcn/ui.
  - Novos componentes devem ser adicionados via `npx shadcn@latest add [nome]`.
  - Componentes customizados devem seguir o padrão do shadcn (radix-ui + tailwind).
- **Ícones**: Lucide React.
- **Responsividade**: Mobile-first.

## 3. Formulários e Validação

- **Biblioteca**: React Hook Form.
- **Validação**: Zod.
- **Integração**: `@hookform/resolvers/zod`.
- **Padrão**:
  - Definir schema Zod.
  - Tipar formulário com `z.infer<typeof Schema>`.
  - Usar componente `Form` do shadcn.

## 4. Convenções de Código

- **Nomenclatura**:
  - Arquivos e pastas: `kebab-case` (ex: `user-profile.tsx`, `components/ui/button.tsx`).
  - Componentes: `PascalCase` (ex: `UserProfile`).
  - Funções e variáveis: `camelCase`.
  - Constantes: `UPPER_SNAKE_CASE`.
- **Organização**:
  - `src/app`: Rotas e páginas.
  - `src/components`: Componentes reutilizáveis globais.
  - `src/app/(auth)/login/_components`: Componentes específicos de uma página/fluxo.
  - `src/lib`: Utilitários, configurações de clientes (axios, queryClient).
  - `src/actions`: Server Actions.
  - `src/hooks`: Custom hooks.
  - `src/types`: Definições de tipos globais.

## 5. Fluxo de Desenvolvimento (Exemplo: Novo Módulo)

1. **Modelagem**: Definir tipos/interfaces baseados no backend.
2. **Server Action**: Criar ação em `src/actions/[modulo].ts` para buscar/salvar dados.
3. **Componente de UI**: Criar formulário ou tabela em `_components`.
4. **Página**: Montar a página em `src/app/[modulo]/page.tsx`, buscando dados iniciais (se server component) e passando para componentes clientes.

## 6. Git e Commits

- Mensagens claras e descritivas.
- Padrão Conventional Commits (opcional, mas recomendado): `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.
