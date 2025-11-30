# PRD --- CS Solutions ERP Desktop (Next.js + Tauri)

## Versão: 1.0 --- 2025

## 1. Objetivo do Projeto

Transformar o ERP CS Solutions, atualmente desenvolvido inteiramente em
Next.js (frontend), em um aplicativo desktop multiplataforma usando
Tauri.

## 2. Arquitetura Geral

### 2.1 Componentes

-   Frontend Next.js exportado como estático
-   Camada Desktop Tauri
-   Backend opcional

## 3. Modo de Funcionamento

-   App abre via Tauri
-   Carrega build estático
-   Funciona online/offline
-   Comunica com backend remoto se existir

## 4. Build e Distribuição

### Build Next.js

    npm run build
    npm run export

### Build Tauri

    cargo tauri build

## 5. Recursos Nativos

-   Arquivos
-   Impressão
-   Notificações
-   Segurança

## 6. Segurança

-   Desabilitar DevTools
-   Assinatura digital
-   Sandbox

## 7. Atualizações Automáticas

-   Feitas pelo Updater do Tauri

## 8. Estrutura do Projeto

    /out
    /src-tauri

## 9. Configuração Base

Arquivo `tauri.conf.json` com paths e build.

## 10. Testes

-   Funcionais
-   Segurança
-   Performance

## 11. Entregáveis

-   Executável Windows
-   Código fonte Tauri
-   Documentação

## 12. Futuras Expansões

-   ACBr
-   Offline total
-   Impressão térmica
