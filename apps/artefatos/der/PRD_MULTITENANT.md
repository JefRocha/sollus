### **PRD: Refatoração para Arquitetura Multitenant**

**1. Contexto e Justificativa**

*   **Situação Atual:** O sistema `backend` opera em um modelo **single-tenant** (um inquilino por instância). A gestão dos múltiplos clientes é feita pelo sistema `retaguarda-sh`, que orquestra e monitora dezenas de instâncias independentes da aplicação e do banco de dados.
*   **Problemas do Modelo Atual:**
    *   **Alto Custo de Infraestrutura:** Cada cliente consome um conjunto dedicado de recursos (RAM, CPU), resultando em alto custo e desperdício com recursos ociosos.
    *   **Manutenção Complexa:** A aplicação de atualizações, patches de segurança ou novas funcionalidades é um processo de alto risco e custo operacional, pois exige a atualização individual de cada instância.
    *   **Lentidão no Onboarding:** A ativação de um novo cliente é um processo manual e lento, envolvendo o provisionamento de uma nova infraestrutura completa.
*   **Objetivo do Projeto:** Transformar a aplicação `backend` em uma arquitetura **multitenant com banco de dados compartilhado**. O objetivo é centralizar a operação em uma única instância da aplicação e do banco de dados, visando aumentar a eficiência, reduzir custos e simplificar drasticamente a manutenção.

**2. Requisitos Chave**

*   **R1: Isolação Total de Dados:** Os dados de um cliente (tenant) devem ser logicamente inacessíveis por qualquer outro cliente. Esta é a diretriz de maior prioridade.
*   **R2: Administração Centralizada de Clientes:** O `retaguarda-sh` deve evoluir para um painel de "Super Admin", permitindo à software house gerenciar clientes (criar, desativar, configurar planos) através de uma interface que consome uma API segura do `backend`.
*   **R3: Identificação de Cliente por Requisição:** O sistema deve ser capaz de identificar qual cliente está fazendo a requisição (via token JWT) e usar essa informação para filtrar todos os acessos a dados.

**3. Proposta de Implementação Técnica (Plano de Ação)**

A transformação será dividida em fases para mitigar riscos.

**Fase 1: Adequação do Schema do Banco de Dados**

O objetivo desta fase é preparar a estrutura do banco de dados para suportar múltiplos clientes.

*   **1.1. Identificar Entidades:** Analisar todas as tabelas do banco de dados (`sollus.sql`).
*   **1.2. Adicionar Chave Estrangeira `ID_EMPRESA`:** Adicionar uma coluna `ID_EMPRESA` (com `FOREIGN KEY` para a tabela `EMPRESA`) em todas as tabelas que contêm dados pertencentes a um cliente.
    *   **Exemplos de tabelas a serem modificadas:** `PRODUTO`, `CLIENTE`, `FORNECEDOR`, `COLABORADOR`, `USUARIO`, `VENDA_CABECALHO`, `FIN_LANCAMENTO_PAGAR`, `BANCO_CONTA_CAIXA`, etc. (praticamente todas as tabelas de negócio).
    *   **Exemplos de tabelas que permanecem globais:** `UF`, `MUNICIPIO`, `NCM`, `CFOP` (dados públicos ou de padrão nacional).
*   **1.3. Modificar Entidades no Código:** Replicar a mudança do banco de dados nas entidades TypeORM (`*.entity.ts`), adicionando o relacionamento:
    ```typescript
    @ManyToOne(() => Empresa)
    @JoinColumn({ name: "ID_EMPRESA" })
    empresa: Empresa;
    ```

**Fase 2: Identificação e Contexto do Cliente (Tenant)**

O objetivo é fazer a aplicação saber "quem" está fazendo a requisição.

*   **2.1. Ajustar Login:** Modificar o módulo de `login` para que, após a autenticação, o `ID_EMPRESA` do `USUARIO` seja incluído no payload do token JWT.
*   **2.2. Criar Serviço de Contexto:** Implementar um `TenantService` com escopo de requisição (`@Injectable({ scope: Scope.REQUEST })`). Este serviço irá extrair o `empresaId` do token em cada requisição e disponibilizá-lo para o resto da aplicação.

**Fase 3: Filtragem Automática de Dados**

Esta é a fase mais crítica, para garantir a segurança e o isolamento dos dados.

*   **3.1. Criar Repositório Base:** Desenvolver uma classe `BaseRepository` customizada que estende o `Repository` do TypeORM.
*   **3.2. Sobrescrever Métodos:**
    *   O método `save` (e `create`) deve ser modificado para injetar automaticamente o `id_empresa` (obtido do `TenantService`) antes de salvar uma nova entidade.
    *   Os métodos de busca (`find`, `findOne`, `count`, etc.) devem ser modificados para adicionar **automaticamente** a cláusula `WHERE ID_EMPRESA = :tenantId` em todas as consultas.
*   **3.3. Integrar com `@nestjsx/crud`:** Este é um **ponto de atenção**. Será necessária uma investigação técnica para garantir que os endpoints gerados por esta biblioteca utilizem o nosso `BaseRepository` customizado, aplicando assim os filtros de `ID_EMPRESA` em todas as operações CRUD.

**Fase 4: Migração dos Dados**

*   **4.1. Planejar Script de Migração:** Desenvolver um script complexo que irá ler os dados de todos os bancos de dados single-tenant atuais.
*   **4.2. Executar a Migração:** O script irá inserir os dados no novo banco de dados compartilhado, preenchendo a nova coluna `ID_EMPRESA` corretamente para cada registro. Este processo exigirá uma janela de manutenção (downtime).

**4. Riscos e Mitigações**

*   **Risco 1: Vazamento de dados entre clientes.**
    *   **Mitigação:** Revisão de código rigorosa, testes automatizados para cada entidade garantindo que o filtro de `ID_EMPRESA` é aplicado, e testes de penetração simulando um cliente tentando acessar dados de outro.
*   **Risco 2: Complexidade da integração com `@nestjsx/crud`.**
    *   **Mitigação:** Realizar uma "investigação técnica" (spike) focada apenas neste ponto antes de iniciar o desenvolvimento da Fase 3, para provar que a integração é viável.
*   **Risco 3: Falha na migração de dados.**
    *   **Mitigação:** Testar o script de migração exaustivamente em um ambiente de homologação (staging) com cópias dos bancos de dados reais. Realizar backups completos antes de iniciar o processo em produção.

**5. Próximos Passos**

1.  Aprovar este PRD.
2.  Iniciar a investigação técnica sobre a integração com `@nestjsx/crud`.
3.  Começar o desenvolvimento da **Fase 1**.
