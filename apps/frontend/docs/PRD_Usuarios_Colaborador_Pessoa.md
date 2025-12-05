# PRD – Relações de Usuário, Colaborador e Pessoa (Treinamento)

## Visão Geral
Este documento explica como as entidades Pessoa, Colaborador e Usuário se relacionam no Sollus ERP e quais são as regras de negócio associadas às chaves estrangeiras (FKs). O objetivo é ajudar usuários e administradores a operar o sistema corretamente, evitando erros de integração e entendendo os fluxos padrão.

## Entidades e Vínculos
- Pessoa
  - Registro central de pessoas físicas ou jurídicas.
  - Possui indicadores como “É Cliente”, “É Fornecedor”, “É Transportadora”, “É Colaborador”.
- Colaborador
  - Deriva de Pessoa quando “É Colaborador = Sim”.
  - Contém dados específicos de funcionários/colaboradores.
- Usuário
  - Autenticação e autorização no sistema.
  - Aponta para um Colaborador via `idColaborador`.
  - Aponta para um Papel/Perfil via `idPapel` (controle de acesso).

## Regras de Negócio e FKs
- FK `usuario.idColaborador → colaborador.id`
  - Não é permitido remover/excluir o Colaborador enquanto existir Usuário vinculado.
  - Ao desmarcar “É Colaborador” em Pessoa, o backend tenta limpar vínculos; se houver Usuário, ocorre violação de FK.
  - Ação correta: primeiro remover ou migrar o Usuário para outro Colaborador, depois ajustar o status de Colaborador.
- Papel/Perfil (`usuario.idPapel`)
  - Determina acesso a funcionalidades (ex. menus marcados como “masterOnly” exigem papel de administrador/master).

## Fluxos Comuns
1. Criar Pessoa e habilitar “É Colaborador”
   - Acesse o cadastro de Pessoa, marque “É Colaborador = Sim”.
   - Complete dados necessários do Colaborador no módulo Colaboradores.
2. Criar Usuário para um Colaborador
   - No módulo Usuário, selecione o Colaborador (não digite apenas o ID; use busca/seleção quando disponível).
   - Defina `idPapel` conforme o perfil desejado.
3. Desabilitar “É Colaborador” para uma Pessoa
   - Verifique se existe Usuário vinculado ao Colaborador dessa Pessoa.
   - Caso exista, remova/migre o Usuário primeiro; depois desmarque “É Colaborador”.
4. Excluir Colaborador
   - Remova/migre o Usuário vinculado antes de excluir o Colaborador.

## Mensagens, Erros e Como Resolver
- “Atualização ou exclusão em tabela ‘colaborador’ viola restrição de chave estrangeira ‘fk_usuario_colaborador1’ em ‘usuario’”
  - Causa: tentativa de remover Colaborador com Usuário vinculado.
  - Solução: remover/migrar Usuário e repetir a operação.
- “Cannot GET /cliente” ou 404/500 em endpoints de métricas (dashboard)
  - Causa: rota inexistente ou diferente do esperado.
  - Solução: usar as rotas corretas do backend; o sistema tenta caminhos alternativos, mas é recomendável alinhar endpoints.

## Boas Práticas
- Sempre crie Usuário a partir de um Colaborador existente (evite IDs manuais).
- Ao alterar indicadores de Pessoa (Cliente/Fornecedor/Transportadora/Colaborador), confira as abas correspondentes e preencha dados mínimos.
- Para rearranjo de acessos, ajuste `idPapel` do Usuário; não altere manualmente FKs no banco.
- Em integrações, padronize rotas e formatos (use `data`, `content`, `count` ou `total`).

## Perguntas Frequentes (FAQ)
- Posso desmarcar “É Colaborador” com Usuário ativo?
  - Não. Primeiro remova/migre o Usuário. Caso contrário, ocorrerá violação de FK.
- Onde edito dados de Colaborador?
  - No módulo “Colaboradores”. A aba “Colaborador” em Pessoa direciona para criar/editar no módulo correto.
- O menu mostra itens “masterOnly”. Como habilitar?
  - Configure o `idPapel` do Usuário para um perfil com acesso master/administrador.
- Dashboard não mostra métricas?
  - Verifique rotas do backend. O sistema usa tentativas alternativas, mas rotas corretas melhoram precisão e desempenho.

## Referências no Sistema
- Serviço de Usuário: `src/app/cadastros/usuario/usuario.service.ts`
- Validação de Usuário: `src/app/cadastros/usuario/usuario.zod.schema.ts`
- Formulário de Usuário: `src/app/cadastros/usuario/_components/usuario-form.tsx`
- Salvaguardas em Pessoa/Colaborador: `src/app/cadastros/pessoa/[id]/editar/page.tsx` e `src/app/cadastros/pessoa/_components/FormTabs.tsx`
- Menu/Perfis master: `src/components/layout/sidebar.tsx`

---
Este documento deve ser utilizado como base de treinamento de usuários e administradores, servindo de orientação para evitar erros de chave estrangeira e para entender os vínculos de dados no Sollus ERP.
