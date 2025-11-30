# PRD --- CS Solutions ERP Desktop (Next.js + Tauri)

## Versão: 1.1 --- 2025

------------------------------------------------------------------------

# 1. Objetivo do Projeto

Transformar o ERP CS Solutions --- atualmente um frontend completo em
Next.js com 824 tabelas --- em um aplicativo Desktop multiplataforma
robusto, utilizando Tauri, oferecendo maior estabilidade, performance,
experiência profissional e recursos nativos.

------------------------------------------------------------------------

# 2. Justificativa e Benefícios Para o Usuário Final

## 2.1 Benefícios de Performance

-   Carregamento extremamente rápido (arquivos locais)
-   Redução de travamentos e quedas de sessão
-   Ambiente de renderização uniforme (WebView2)

## 2.2 Benefícios de Estabilidade

-   Aplicação isolada de extensões do navegador
-   Zero interferência de plugins, cookies corrompidos ou cache
-   Sessões mais consistentes

## 2.3 Experiência Desktop Profissional

-   Ícone no Windows / Mac
-   Abertura rápida via atalho
-   Possibilidade de múltiplas janelas para módulos diferentes
-   Aplicação se comporta como software corporativo (TOTVS / Sankhya /
    Odoo nível)

## 2.4 Recursos Não Disponíveis no Navegador

-   Acesso a arquivos e pastas
-   Importação de XML, CSV, PDF
-   Impressão térmica, etiquetas, relatórios
-   Notificações do sistema operacional
-   Minimização para tray
-   Janelas independentes

## 2.5 Redução de Suporte Técnico

-   Menos erros de navegador
-   Menos reclamações de lentidão
-   Ambiente padronizado entre todos os clientes

## 2.6 Atualizações Automáticas

-   Entrega contínua
-   Atualizações silenciosas
-   Menor fricção com o usuário

------------------------------------------------------------------------

# 3. Modo Offline (Estratégia)

## 3.1 Offline Parcial (imediato)

Módulos que podem operar com cache local: - PDV - Orçamentos -
Pré-vendas - Anotações - Movimentação rápida de estoque

## 3.2 Offline Completo (futuro)

Inclui: - SQLite local criptografado - Sincronização incremental -
Conflitos tratáveis - Estratégia de merge por timestamps

## 3.3 Benefícios do Offline

-   Continuidade das operações em quedas de internet
-   Redução de perdas operacionais
-   Aumento de confiabilidade

------------------------------------------------------------------------

# 4. Arquitetura Geral

## 4.1 Componentes

-   Frontend Next.js (existente)
-   Tauri Desktop Shell
-   WebView2 (Windows), WKWebView (Mac), WebKitGTK (Linux)

## 4.2 Fluxo de Execução

1.  App inicia via Tauri
2.  Carrega build estático do Next.js
3.  Opera localmente
4.  Comunica com backend remoto quando necessário
5.  Permite recursos nativos via Tauri APIs

------------------------------------------------------------------------

# 5. Build e Distribuição

## 5.1 Build Next.js

    npm run build
    npm run export

## 5.2 Build Tauri

    cargo tauri build

------------------------------------------------------------------------

# 6. Recursos Nativos Disponíveis

-   FS (abrir/salvar arquivos)
-   Impressão
-   Notificações
-   Diálogo de seleção de pastas
-   Multi-janelas
-   Comunicação via Tauri Commands

------------------------------------------------------------------------

# 7. Segurança

-   DevTools desativado na produção
-   Sandbox Tauri
-   Assinatura digital dos binários
-   Limitação de permissões em filesystem
-   Criptografia de dados locais

------------------------------------------------------------------------

# 8. Atualizações Automáticas

-   Feitas via Tauri Updater
-   Baseadas em GitHub Releases / Supabase Storage
-   Download silencioso
-   Reinício automático opcional

------------------------------------------------------------------------

# 9. Estrutura do Projeto

    /erp
      /app
      /components
      /public
      /out
      /src-tauri
        tauri.conf.json
        /src
          main.rs
        /icons

------------------------------------------------------------------------

# 10. Configuração Base do Tauri

Arquivo `tauri.conf.json`:

    {
      "package": {
        "productName": "CS Solutions ERP",
        "version": "1.1.0"
      },
      "build": {
        "beforeBuildCommand": "npm run build && npm run export",
        "distDir": "../out",
        "devPath": "http://localhost:3000"
      },
      "tauri": {
        "windows": [
          {
            "title": "CS Solutions ERP",
            "width": 1400,
            "height": 900
          }
        ],
        "bundle": {
          "identifier": "com.cssolutions.erp"
        }
      }
    }

------------------------------------------------------------------------

# 11. Testes

## 11.1 Funcionais

-   Navegação entre módulos
-   Upload/download
-   Impressão
-   Notificações

## 11.2 Segurança

-   Acesso a pastas controlado
-   DevTools desativado
-   Permissões revisadas

## 11.3 Performance

-   FPS estável
-   Memória \< 300MB
-   Tempo de abertura \< 3s

------------------------------------------------------------------------

# 12. Entregáveis

-   Aplicativo Windows (.exe)
-   Projeto `/src-tauri` completo
-   Build multiplataforma
-   Documentação de instalação
-   Sistema de atualização automática

------------------------------------------------------------------------

# 13. Futuras Expansões

-   Integração ACBr Desktop
-   Modo offline total
-   Sincronização avançada
-   Impressão fiscal integrada
