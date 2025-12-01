Documento de Requisitos do Produto – Integração de nestjs-cls em Next.js 16
1. Visão Geral do nestjs-cls
O nestjs-cls é uma biblioteca para Node/NestJS que implementa CLS (Continuation-Local Storage) usando a API nativa AsyncLocalStorage do Node.js
papooch.github.io
. Em termos simples, ele permite armazenar dados associados a uma execução assíncrona (por exemplo, a requisição HTTP) e disponibilizá-los em qualquer ponto do código durante o ciclo de vida dessa requisição, sem precisar repassar manualmente esses dados em cada chamada de função. Isso funciona de forma semelhante ao Thread-Local Storage em linguagens multithread, porém adaptado ao modelo de loop de eventos do Node
dev.to
dev.to
.
Nota: Aqui, CLS refere-se a Continuation-Local Storage (armazenamento local de continuação) e não deve ser confundido com "Cumulative Layout Shift", métrica de performance front-end também abreviada como CLS.
O nestjs-cls abstrai o uso do AsyncLocalStorage fornecendo o módulo ClsModule e o serviço injetável ClsService próprios do NestJS
docs.nestjs.com
docs.nestjs.com
. Com ele, podemos integrar facilmente o armazenamento de contexto em aplicações Nest, aproveitando o sistema de injeção de dependência do framework. A biblioteca fornece melhorias de DX (developer experience) sobre usar AsyncLocalStorage puro, como tipagem forte do conteúdo armazenado e integração transparente com diversos tipos de transporte (HTTP, micro-serviços, GraphQL, etc.)
docs.nestjs.com
. Para que serve? Principalmente, o nestjs-cls serve para manter estado por requisição sem poluir seu código com parâmetros extras. Permite que partes distintas da aplicação acessem um contexto compartilhado daquela requisição – por exemplo, dados do usuário logado, um ID de correlação para logs, preferências de localidade, entre outros – sem recorrer a variáveis globais inseguras ou repassar objetos. A própria documentação lista casos de uso comuns possibilitados pela biblioteca, incluindo:
Rastreio de ID de requisição e metadados para logs;
Manter disponível a informação do usuário atual em qualquer ponto da requisição;
Suporte a multi-tenant (ex: disponibilizar um TenantID para garantir que consultas ao banco filtrem dados do inquilino correto);
Propagação automática de transações de banco de dados entre serviços sem quebrar encapsulamento (com ajuda de plugins adicionais);
Armazenar contexto de autenticação (permissões/roles) acessível em toda a requisição;
Evitar escopos de injeção REQUEST ou passagem manual de contexto em cenários onde isso não é suportado diretamente (estratégias do Passport, jobs em fila, WebSockets, etc.)
papooch.github.io
papooch.github.io
.
Em resumo, nestjs-cls fornece um "contexto local" isolado por requisição, acessível em qualquer parte do código, tornando a implementação de features como logging contextualizado e identificação do usuário muito mais limpa e segura.
2. Benefícios do uso de CLS em aplicações Next.js (Frontend)
No contexto de um projeto frontend com Next.js 16, que tipicamente envolve renderização no servidor (SSR) e APIs rodando em Node.js, o uso de CLS traz diversos benefícios em termos de performance, organização do código e observabilidade:
Evitar passagem explícita de contexto: Next.js (especialmente a partir da versão 13 com o App Router) permite escrever código servidor (em rotas API ou em componentes server-side). Com CLS, podemos evitar o “props drilling” no servidor, isto é, não precisamos passar manualmente informações como ID de usuário, token de requisição ou outros dados através de várias funções ou componentes. Qualquer função dentro do escopo da requisição pode recuperar esses dados do armazenamento local assíncrono
dev.to
, mantendo o código mais limpo.
Rastreio de requisições e logs correlacionados: Em aplicações complexas, uma única requisição pode disparar várias ações no servidor – por exemplo, carregar dados de múltiplos serviços internos. Com CLS, podemos atribuir um ID único à requisição no início do processamento e armazená-lo no contexto. Em seguida, todos os logs gerados naquele ciclo podem incluir automaticamente esse ID (buscando do ClsService), o que facilita correlação de logs e debugging. Isso é extremamente útil para monitoramento e para depurar problemas de produção, pois podemos seguir o rastro de cada requisição ponta a ponta.
Disponibilidade de dados do usuário em qualquer camada: No SSR do Next, pode ser necessário acessar informações do usuário autenticado (por exemplo, obtidas de um cookie JWT ou sessão) em diferentes partes – talvez em métodos utilitários ou na lógica de rendering – sem repassar explicitamente o objeto de usuário. Com CLS, podemos armazenar dados do usuário logado assim que a requisição chega (em um middleware ou no handler inicial) e depois acessá-los em funções de negócio ou componentes server-side mais profundamente aninhados, simplesmente consultando o contexto. Isso simplifica a lógica de autenticação/autorização distribuída pelo código.
Armazenamento temporário seguro entre chamadas: Next 16 e versões recentes suportam rotas aninhadas, paralelas e até streaming de respostas. O CLS pode assegurar que, mesmo com a execução de várias operações assíncronas em paralelo durante a renderização, cada operação ainda consiga ler os mesmos dados de contexto inicial. Por exemplo, múltiplas consultas a APIs internas feitas durante a renderização de uma página podem todas incluir automaticamente o mesmo token de autenticação ou ID de rastreio, obtendo do contexto ao invés de ter que repassar esse valor para cada função de fetch.
Isolamento de contexto por requisição: Diferente de soluções caseiras como variáveis globais ou singletons, o CLS garante que dados de uma requisição não vazem para outra. Em um servidor Next.js com Node, múltiplas requisições são atendidas concorrentemente no loop de eventos. O AsyncLocalStorage cria um armazenamento isolado para cada fluxo assíncrono, evitando interferência entre requisições simultâneas. Assim, podemos usar dados "globais" por requisição sem medo de condições de corrida ou mix de informações entre usuários.
Melhoria na limpeza e manutenibilidade do código: Ao centralizar o gerenciamento de certos dados contextuais, o código fica mais limpo e focado na lógica principal. Handlers e componentes não precisam inflar sua assinatura para levar contexto adiante. Isso promove uma arquitetura mais limpa, facilitando manutenção. Deve-se apenas tomar cuidado para não abusar e tornar o contexto uma estrutura opaca onde se coloca “de tudo” (conforme discutiremos em boas práticas).
Em suma, usar CLS em Next.js oferece conveniência similar ao que frameworks backend oferecem (como variáveis de requisição) mesmo no ambiente de front-end com SSR. Inclusive, o Next.js já se aproveita dessa técnica internamente – por exemplo, os métodos utilitários headers() e cookies() disponibilizados em componentes e ações de servidor do Next usam AsyncLocalStorage para fornecer os valores corretos da requisição atual
dev.to
. Ou seja, o CLS já viabiliza funcionalidades mágicas do Next.js, e expandir seu uso a nossos próprios dados traz essas mesmas vantagens para nossa aplicação.
3. Instalação e Configuração do nestjs-cls
Nesta seção, veremos como adicionar e configurar o nestjs-cls no projeto, passo a passo. Lembrando que, apesar do foco ser um projeto Next.js (frontend), a biblioteca será configurada na porção Node.js do aplicativo (por exemplo, em rotas API do Next ou em um servidor NestJS backend integrado). Passo 1: Instalação da biblioteca Como qualquer pacote npm, podemos instalar via npm, yarn ou pnpm. Por exemplo, usando npm:
npm install nestjs-cls
Observação: O nestjs-cls tem dependências peer do NestJS (pacotes @nestjs/core e @nestjs/common, entre outros)
papooch.github.io
. Portanto, ele presume que você já tem o NestJS instalado no seu projeto ou disponível no ambiente. Em um cenário Next.js + NestJS, isso não é um problema, pois a parte backend usa Nest. Caso você esteja tentando usar apenas em funções Node puras no Next, será necessário incluir as dependências do NestJS para satisfazer os requisitos do nestjs-cls.
Passo 2: Importação e configuração do módulo No contexto de uma aplicação NestJS, a maneira idiomática de usar o nestjs-cls é importando o ClsModule no módulo principal (geralmente AppModule). Ao fazer isso, podemos configurar as opções globais do CLS, incluindo montar automaticamente o middleware que inicia o contexto em cada requisição. No seu AppModule (ou módulo principal do backend Nest), importe o ClsModule e chame o método estático forRoot para configurá-lo:
// app.module.ts (NestJS)
import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SomeInterceptor } from './some.interceptor'; // exemplo de interceptor que usará CLS

@Module({
  imports: [
    // Registro do ClsModule com configuração
    ClsModule.forRoot({
      global: true,       // torna disponível globalmente (não precisa importar em cada módulo)
      middleware: { 
        mount: true,      // monta automaticamente o ClsMiddleware em todas as rotas HTTP
        // setup opcional: função para inicializar valores padrão no contexto 
        // setup: (cls, req) => {
        //   cls.set('reqId', req.headers['x-request-id'] || generateUUID());
        // }
      }
    })
  ],
  controllers: [/* ... */],
  providers: [
    // Exemplo: registrando um interceptor global que poderá usar ClsService
    { provide: APP_INTERCEPTOR, useClass: SomeInterceptor }
  ],
})
export class AppModule {}
No exemplo acima, usamos mount: true para que o ClsMiddleware seja automaticamente aplicado a todas as rotas HTTP. Esse middleware é responsável por inicializar um novo contexto CLS para cada requisição, chamando internamente AsyncLocalStorage.run() antes de passar o controle adiante
papooch.github.io
papooch.github.io
. Com global: true, o ClsService (provedor que dá acesso ao contexto) será disponibilizado globalmente na aplicação Nest, ou seja, você poderá injetá-lo em qualquer lugar sem precisar importar explicitamente o módulo em cada feature module.
Dica: A opção middleware.setup nos permite definir lógica de inicialização do contexto – por exemplo, armazenar já no contexto o ID do usuário extraído do token ou um ID de requisição gerado. No trecho comentado acima, poderíamos gerar um UUID para cada requisição e armazenar com a chave 'reqId'. Essa função recebe o serviço CLS e o objeto da requisição, permitindo configurar valores iniciais
docs.nestjs.com
docs.nestjs.com
.
Passo 3: Inicializar o contexto em cada requisição (caso não use Nest) Se seu projeto Next.js 16 não tem um backend NestJS separado e você deseja usar o CLS diretamente nas rotas API ou handlers do Next, precisará garantir que cada requisição seja envolvida por uma chamada ao AsyncLocalStorage. Como o ClsModule e ClsMiddleware são pensados para Nest/Express, podemos optar por usar diretamente o AsyncLocalStorage ou criar um wrapper similar. Uma abordagem simples é criar uma instância única de AsyncLocalStorage e envolver os handlers do Next.js manualmente:
// lib/cls.ts - configuração manual de AsyncLocalStorage se não estiver usando NestJS
import { AsyncLocalStorage } from 'node:async_hooks';

// Definindo o tipo de dados do contexto (pode ser um objeto para armazenar múltiplos valores)
interface ContextStore { [key: string]: any }
export const asyncLocalStorage = new AsyncLocalStorage<ContextStore>();

// Helper para executar um handler dentro do contexto AsyncLocalStorage
export function withAsyncContext(handler: Function) {
  return async function wrappedHandler(...args: any[]) {
    // Cria um novo objeto de contexto para essa requisição
    const store: ContextStore = {};
    // Executa o handler dentro do contexto isolado
    return asyncLocalStorage.run(store, () => handler(...args));
  }
}
Com esse helper, podemos exportar nossos handlers de rota do Next já encapsulados. Por exemplo, em uma rota API do Next (pasta pages/api ou usando App Router em app/api):
// pages/api/example.ts (usando Pages Router) ou app/api/example/route.ts (App Router)
import type { NextApiRequest, NextApiResponse } from 'next';
import { withAsyncContext, asyncLocalStorage } from '../../lib/cls';

// Handler simples que utiliza o contexto async local
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Podemos, por exemplo, armazenar info do usuário no contexto:
  const store = asyncLocalStorage.getStore();
  if (store) {
    store['userId'] = req.headers['x-user-id'] ?? null;
  }

  // ... lógica da rota ...
  const responseData = { msg: 'Hello', user: store?.['userId'] };
  res.status(200).json(responseData);
}

// Exportamos o handler encapsulado no contexto CLS
export default withAsyncContext(handler);
No exemplo acima, usamos withAsyncContext ao exportar o handler para garantir que cada chamada execute dentro de um contexto AsyncLocalStorage isolado. Dentro do handler, podemos obter o store atual via asyncLocalStorage.getStore() e definir ou ler propriedades conforme necessário.
Essa estratégia manual é equivalente ao que a biblioteca @nextwrappers/async-local-storage implementa de forma mais genérica para Next.js 13+
dev.to
dev.to
. Caso prefira, você pode usar tal biblioteca para evitar escrever o wrapper por conta própria – ela fornece um utilitário asyncLocalStorageWrapper que facilita envolver handlers com CLS.
Passo 4: Integração em servidor customizado (opcional) Outra opção (mais avançada) em projetos Next auto-hospedados é usar um servidor custom Express integrando o NestJS. Nesse cenário, você inicializa o app Next dentro de um servidor Node/Express e pode então aplicar o ClsMiddleware antes de delegar para o Next:
// server.ts - Servidor Node custom que integra Next + Nest
import express from 'express';
import next from 'next';
import { ClsMiddleware } from 'nestjs-cls';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // seu módulo Nest

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

async function bootstrap() {
  await nextApp.prepare();
  const server = express();

  // (a) Inicializa NestJS app
  const nestApp = await NestFactory.create(AppModule);
  // Habilita o ClsMiddleware globalmente no Nest (já feito via forRoot no AppModule)
  await nestApp.init();

  // (b) Monta rotas da API NestJS no servidor Express (supondo que API esteja sob /api)
  server.use('/api', (req, res) => {
    nestApp.getHttpAdapter().getInstance()(req, res);
  });

  // (c) Aplica o request handler do Next para outras rotas
  server.all('*', (req, res) => handle(req, res));

  server.listen(3000, () => console.log('Server ready on http://localhost:3000'));
}
bootstrap();
No trecho acima, a chamada nestApp.init() monta os middlewares globais do Nest (incluindo o ClsMiddleware, configurado via forRoot anteriormente). Assim, requisições que entrarem em rotas da API (/api/*) serão atendidas pelo Nest + Cls, e as demais cairão para o Next. Essa abordagem garante que mesmo as páginas SSR do Next, se interagirem com o backend Nest, aproveitem o contexto CLS do lado do servidor Node. (Obs: A implementação exata pode variar; o importante é entender que, se você tem um backend NestJS rodando junto, siga os passos padrão de configuração do ClsModule no Nest. Se não tiver Nest, use a abordagem manual com AsyncLocalStorage.)
4. Integração com Handlers de Requisição e Middlewares no Next.js 16
Agora que o nestjs-cls (ou o CLS manual) está configurado, vejamos como integrá-lo aos fluxos de requisição no Next.js 16 – tanto em nível de handlers (rotas) quanto em middlewares. Handlers de requisição (Rotas API e Renderização SSR):
Rotas API Next (App Router ou Pages): Conforme exemplificado, ao exportar o handler com um wrapper (withAsyncContext), garantimos que cada chamada da API tenha um contexto isolado. Dentro do handler, podemos usar o ClsService (no caso de Nest) ou a instância do AsyncLocalStorage diretamente para setar e obter valores. Por exemplo, suponha que queiramos registrar um requestId e o usuário para cada chamada API:
// Exemplo dentro de um handler API Next (já dentro do contexto CLS)
const store = asyncLocalStorage.getStore();
if (store) {
  store['requestId'] = req.headers['x-request-id'] || generateUUID();
  store['user'] = decodeAuthToken(req.headers['authorization']);
}
// ... depois, em qualquer função chamada pelo handler ...
const currentUser = asyncLocalStorage.getStore()?.['user'];
Se estivermos usando NestJS no backend, a lógica seria similar porém via ClsService injetado: usar this.cls.set('user', userObj) no início e this.cls.get('user') nas camadas posteriores.
Renderização de páginas (getServerSideProps / Server Components): No Next tradicional (Pages Router), funções como getServerSideProps ou getInitialProps também rodam no servidor Node para cada requisição. Podemos aplicar o mesmo conceito encapsulando sua execução. Por exemplo:
export const getServerSideProps = withAsyncContext(async (context) => {
  const { req, res } = context;
  const store = asyncLocalStorage.getStore();
  store && (store['tenant'] = req.headers['x-tenant-id'] || null);

  // ... obter dados, podendo acessar store['tenant'] em funções chamadas ...
  const data = await fetchDataForTenant(store?.['tenant']);
  return { props: { data } };
});
Já no App Router (Next 13+), os Server Components e Server Actions automaticamente podem acessar o contexto AsyncLocalStorage do Node. Assim, se o contexto foi iniciado no handler da rota (por exemplo, na função GET da página), qualquer código rodando durante a renderização dessa página (como dentro de componentes assíncronos) terá acesso ao mesmo contexto. Isso acontece porque toda a execução da renderização acontece dentro do callback provido ao AsyncLocalStorage.run.
Vale ressaltar que, se o Next estiver fazendo streaming de uma resposta ou processando segmentos em paralelo, ainda assim as APIs do React/Next (como headers() mencionada) funcionam via CLS global. Para nossos dados customizados, contanto que iniciemos o contexto no início da requisição, as partes paralelas da renderização o compartilharão corretamente. Apenas se tomarmos a iniciativa de criar novos loops assíncronos fora do escopo (por exemplo, disparar um setTimeout não aguardado) poderíamos perder o contexto – o que deve ser evitado.
Middlewares Next.js: O Next.js possui um recurso de Middleware (arquivo middleware.ts na raiz) que atua nas requisições antes de chegarem às rotas, frequentemente rodando em ambiente Edge. É importante entender uma limitação: middlewares do Next (Edge) não conseguem compartilhar estado com o código Node posterior. Se você tentar inicializar um AsyncLocalStorage no middleware edge, ele não será acessível nos handlers SSR ou API (que rodam em outro contexto/runtime)
stackoverflow.com
. Portanto, para usar CLS efetivamente no Next, as abordagens são:
Inicializar o contexto no Node runtime (handlers SSR/API) em vez de no middleware edge. Ou seja, mova a lógica de início do contexto para o primeiro ponto de entrada no lado Node (por exemplo, dentro de getServerSideProps ou no handler API, conforme mostrado).
Se precisar muito de um dado do middleware edge, passe-o adiante via mecanismos tradicionais: por exemplo, o middleware poderia anexar um header ou cookie à requisição (ex: x-request-id) e o handler Node ler esse valor e armazenar no contexto CLS. Essa é uma forma de mitigar a separação de ambientes – propagar dados via header/cookie do Edge para o Node, e então colocá-los no AsyncLocalStorage do Node. Essa técnica foi usada no exemplo de autenticação com nestjs-cls + Next: insere-se o ID de usuário num header (x-user-id) no front, então no backend um interceptor retira do header e coloca no contexto
zenstack.dev
.
Em servidores Node unificados (sem edge): Se você não usa middleware edge do Next (por exemplo, aplicações self-hosted sem utilizar Vercel Edge Functions), e sim apenas middlewares Express no servidor Node, então pode montar o ClsMiddleware (no caso do Nest) ou seu próprio middleware Express que chama AsyncLocalStorage.run. Certifique-se de montá-lo antes de quaisquer outros middlewares que possam lidar com a requisição. Assim, todos os próximos handlers já verão o contexto.
Exemplo: Em um servidor Express custom (vide Passo 4 acima), você poderia chamar server.use((req, res, next) => asyncLocalStorage.run({}, () => next())); como primeiro middleware – mas o nestjs-cls já nos fornece isso pronto via ClsModule.forRoot({ middleware: { mount: true } })
papooch.github.io
.
Resumindo a integração: A chave é inicializar o contexto CLS assim que a requisição chegar no lado Node e garantir que toda a lógica subsequente (middlewares, controladores, funções utilitárias) sejam executadas dentro desse contexto. Feito isso, componentes isolados do código podem usar o ClsService ou AsyncLocalStorage.getStore() para acessar dados da requisição em andamento sem depender de parâmetros explícitos.
5. Exemplos de Uso Típicos do nestjs-cls
Vamos agora a alguns exemplos práticos de uso do CLS em um projeto Next/Nest, demonstrando como ele melhora a limpeza do código e facilita certos recursos.
Exemplo 1: Armazenar informações do usuário logado
Imagine que ao tratar uma requisição, você extraia o usuário autenticado (por um token JWT ou sessão). Com nestjs-cls, podemos guardar esse objeto de usuário no contexto e acessá-lo em qualquer camada:
No início da requisição (por exemplo, em um interceptor global NestJS ou no handler Next imediatamente após validar autenticação):
// auth.interceptor.ts (NestJS) - Interceptor para armazenar usuário no CLS
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const user = req.user; // supondo que um middleware de auth populou req.user
    if (user) {
      this.cls.set('currentUser', user);
    }
    return next.handle();
  }
}
No Next sem Nest, lógica similar seria feita no handler: obter user e definir store['currentUser'].
Em qualquer serviço ou função posteriormente:
// user.service.ts - Serviço que obtém dados do usuário atual sem receber explicitamente
@Injectable()
export class UserService {
  constructor(private readonly cls: ClsService, private readonly repo: UserRepository) {}
  getProfile() {
    const currentUser = this.cls.get('currentUser');
    if (!currentUser) throw new Error('Usuário não autenticado');
    return this.repo.findById(currentUser.id);
  }
}
Observe que UserService não precisou receber o usuário como parâmetro ou ter escopo de requisição – ele simplesmente obtém do contexto. Caso essa função fosse chamada durante a renderização SSR de uma página Next, contanto que estejamos dentro do AsyncLocalStorage.run daquela requisição, funcionaria do mesmo modo usando asyncLocalStorage.getStore()?.['currentUser'].
Exemplo 2: Rastreamento de requisição (Request ID para logs)
Para correlacionar logs, é comum gerar um ID único por requisição. Com CLS, podemos automatizar isso:
Gere um UUID assim que a requisição entrar e armazene no contexto:
// req-id.middleware.ts (Express middleware ou Nest Middleware)
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  use(req: Request, res: Response, next: Function) {
    const reqId = generateUUID();
    this.cls.set('reqId', reqId);
    res.setHeader('X-Request-ID', reqId); // opcional: expor o ID na resposta
    next();
  }
}
(No Nest com mount: true, talvez seja mais simples usar ClsModule.forRoot({ middleware: { setup: (cls, req) => cls.set('reqId', uuid()) } }) em vez de um middleware custom.)
Nos pontos de log, recuperar o ID do contexto:
// logger.service.ts
@Injectable()
export class LoggerService {
  constructor(private readonly cls: ClsService) {}
  log(message: string) {
    const reqId = this.cls.get('reqId') || 'N/A';
    console.log(`[${reqId}] ${message}`);
  }
}
Assim, qualquer chamada loggerService.log('Algo aconteceu') automaticamente prefixará o log com o identificador daquela requisição, sem precisar que cada chamada de log receba o ID como argumento.
Em uma aplicação Next sem Nest, poderíamos conseguir efeito semelhante configurando um logger global que use asyncLocalStorage.getStore() para pegar um ID. Por exemplo, usando um hook global:
function log(message: string) {
  const store = asyncLocalStorage.getStore();
  const reqId = store?.['reqId'] || 'N/A';
  console.log(`[${reqId}] ${message}`);
}
E garantindo que store['reqId'] foi setado no início (via wrapper do handler).
Exemplo 3: Armazenar dados temporários entre middleware e controlador
Imagine que temos um middleware que realiza alguma computação pesada ou parsing (por exemplo, parse de um body específico, ou verificação de um header especial) e queremos evitar recalcular isso no controlador. Com CLS, o middleware pode colocar o resultado no contexto, e o controlador simplesmente ler:
Middleware de parsing:
// locale.middleware.ts - extrai localidade preferida e armazena
import { ClsService } from 'nestjs-cls';
@Injectable()
export class LocaleMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}
  use(req: Request, res: Response, next: Function) {
    const locale = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
    this.cls.set('locale', locale);
    next();
  }
}
Controller usando o resultado:
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService, private readonly cls: ClsService) {}
  @Get()
  listProducts() {
    const locale = this.cls.get('locale') as string;
    return this.productService.findAll({ locale });
  }
}
Aqui o controlador não precisou refazer o parsing do header Accept-Language nem recebê-lo via parâmetro – ele obtém do contexto definido pelo middleware. Isso torna o contrato do método mais limpo (não precisa aceitar locale) e evita trabalho duplicado.
Exemplo 4: Transações de banco de dados entre chamadas (avançado)
Um caso de uso mais avançado (principalmente backend) é propagar uma transação de banco de dados em múltiplos serviços ou repositórios automaticamente. A biblioteca nestjs-cls inclusive oferece plugins para integração com ORMs (como TypeORM, Prisma) para permitir algo chamado transaction context. Por exemplo, com o plugin @nestjs-cls/transactional e adaptadores, você pode iniciar uma transação em um serviço e ele coloca a instância da transação no CLS. Outros serviços ou repositórios, ao serem chamados dentro do mesmo fluxo, recuperam a transação do contexto em vez de abrir outra, garantindo que tudo participe da mesma transação
papooch.github.io
. Isso acontece nos bastidores sem você precisar passar explicitamente o objeto da transação em cada chamada de função – o plugin, via CLS, faz o lookup automático. (Esse cenário extrapola o front-end Next, mas é útil mencionar para ilustrar o poder do CLS em manter dados arbitrários globais no escopo de uma requisição.)
Os exemplos acima demonstram como CLS elimina a necessidade de variáveis globais e parâmetros extras, resultando em código mais conciso e modular. Cada componente (middleware, interceptor, serviço, etc.) foca na sua responsabilidade e usa o contexto compartilhado apenas para ler/escrever o que lhe interessa, sem acoplamento forte.
6. Boas Práticas de Performance e Prevenção de Vazamento de Contexto
Embora o uso de AsyncLocalStorage e do nestjs-cls traga muitos benefícios, é importante atentar para algumas boas práticas para garantir alta performance e evitar problemas de memory leak ou vazamento de dados entre requisições. a) Entenda o custo e use com propósito claro: Qualquer overhead de performance introduzido pelo AsyncLocalStorage tende a ser muito pequeno em comparação com operações de I/O (acesso a banco, APIs externas)
papooch.github.io
. Benchmarking informal mostra que rotas com ALS ativo têm diferença de desempenho quase desprezível – em torno de 1% a 3% a menos de requisições por segundo em cenários de carga
dev.to
. Ou seja, para a maioria das aplicações web, o impacto no throughput é insignificante. Ainda assim, não use CLS de forma indiscriminada: utilize-o quando houver um benefício claro (como os casos de uso citados). Evite, por exemplo, ler e escrever no contexto dentro de loops extremamente quentes ou funções chamadas milhões de vezes, se esses dados poderiam ser passados de forma direta com igual simplicidade. Em resumo, pague o pequeno custo do CLS onde ele realmente simplifica o design. b) Mantenha o contexto enxuto: Trate o armazenamento de contexto como um local para dados essenciais e pequenos (IDs, flags, referências leves). Não armazene objetos grandes ou estruturas complexas no CLS. Primeiro porque isso aumenta o consumo de memória por requisição; segundo, objetos complexos podem envolver referências cruzadas difíceis de liberar. Lembre-se de que tudo que colocar no AsyncLocalStorage ficará referenciado até o fim do ciclo da requisição – se colocar algo muito pesado, estará ocupando memória por toda a duração da request. Prefira guardar identificadores e então, se necessário, buscar detalhes via esses IDs em caches ou serviços, ao invés de armazenar, por exemplo, um objeto de usuário completo de 1MB. c) Evite “God Object” no contexto: Relacionado ao item anterior, não transforme o contexto num grande objeto global onde você despeja todo tipo de dado da aplicação (configurações, instâncias inteiras de serviços, etc.). Isso fere a clareza do código e dificulta testes. Use chaves bem definidas e limite o escopo do que vai no CLS ao necessário para identificar contexto de requisição (ex: IDs, usuário, locale, correlação). Se perceber que está passando dados de negócio complexos via contexto, reavalie – talvez esses dados devessem ser passados explicitamente ou esse componente deveria ser refatorado. Lembre-se do alerta: evite criar “objetos Deus” contextuais que tudo acessa
docs.nestjs.com
. d) Inicialize o contexto o mais cedo possível e de forma segura: Quando usar NestJS, prefira a abordagem padrão de ClsMiddleware com AsyncLocalStorage.run (a default) pois ela não vaza contexto entre requisições. Em alguns cenários raros, por bugs de libs ou natureza de certas requisições (especialmente em GraphQL ou microserviços), o contexto pode se “perder” durante a execução
papooch.github.io
. Nesses casos, a biblioteca permite usar o método enterWith() (via ClsGuard ou opção useEnterWith) para criar o contexto de forma diferente. Entretanto, enterWith é menos seguro: enquanto o novo contexto não for explicitamente ativado, requests concorrentes podem enxergar dados residuais do contexto anterior
papooch.github.io
papooch.github.io
. Por isso, se usar enterWith, monte-o imediatamente ao receber a requisição, antes de qualquer outro processamento, garantindo que nenhum código rode com um contexto “antigo”. Em geral, fique com o padrão (run) a não ser que identifique um problema concreto. A maioria das stacks HTTP (Express, Fastify) funcionam bem com run
papooch.github.io
. e) Cuidado com middlewares externos que possam interferir: Alguns middlewares de terceiros no Express podem não ser compatíveis com AsyncLocalStorage e causar perda do contexto (por exemplo, bibliotecas que manipulam o ciclo async de maneiras não convencionais). Se notar que ao usar determinada ferramenta o ClsService.get() começa a retornar undefined no meio do processamento, uma estratégia é montar o ClsMiddleware após esses middlewares “problemáticos”
papooch.github.io
. Assim, mesmo que eles “quebrem” o contexto, você reinicia um contexto novo depois deles. Na dúvida, verifique a seção de Issues conhecidos do repositório do nestjs-cls para ver listas de middlewares incompatíveis e soluções recomendadas
papooch.github.io
. f) Não tente compartilhar contexto entre diferentes runtimes: Conforme mencionado, Next tem divisão entre Edge Middleware e Node runtime – não há como o AsyncLocalStorage atravessar essa barreira
stackoverflow.com
. Também não atravessa processos separados: se sua aplicação estiver escalada em clusters ou múltiplas lambdas, cada processo/lamda tem seu próprio contexto. Tenha isso em mente: CLS é por processo Node. Para compartilhar informações entre serviços ou entre camadas distintas (edge -> node, backend -> backend), continue usando meios padrão (headers, cookies, etc.). O CLS pode ajudar a pegar um header de entrada e repassá-lo adiante aos clientes internos, mas ele não magicamente une contextos de ambientes separados. g) Liberando recursos e evitando leaks: Normalmente, você não precisa “limpar” manualmente o contexto – quando a função dentro de run() retorna (ou seja, no fim da requisição), o AsyncLocalStorage permite que o contexto seja coletado pelo garbage collector. Contudo, um leak pode ocorrer se você, dentro de uma requisição, iniciar operações assíncronas que não são esperadas/aguardadas e que persistam além do término da resposta. Por exemplo, se no meio do request você lançar um setTimeout de longo prazo ou iniciar um Promise não aguardado, ele ainda terá referência ao contexto e poderá segurá-lo vivo. Isso é um antipadrão de qualquer forma (operações “penduradas” depois da resposta). Portanto, garanta encerrar ou cancelar tarefas assíncronas que não tenham utilidade pós-resposta. Em Node serverless (como Vercel Functions), esse risco é mitigado pois o processo encerra após a resposta; mas em servidores contínuos, atenção redobrada. Para verificar se há leaks, você pode realizar testes de estresse e usar ferramentas de profiling de memória – o contexto do CLS de requisições concluídas não deve permanecer alocado. h) Atualize o Node.js para versões recentes: Cada nova versão do Node traz melhorias de performance e correções para async_hooks/AsyncLocalStorage. O AsyncLocalStorage foi introduzido experimentalmente no Node 12 e estabilizado a partir do Node 14+. Se estiver usando Next.js 16 em 2025, provavelmente seu ambiente já é Node 18 LTS ou Node 20. Ambos têm boa estabilidade do ALS. Evite Node 12/13, onde havia mais bugs. Em suma, rodar em Node atualizado garante o melhor desempenho e confiabilidade do CLS. Seguindo essas boas práticas, você obterá o máximo do nestjs-cls com segurança. Em síntese: use conscientemente, armazene pouco, isole bem o contexto e teste em cenários concorrentes. Assim, terá uma funcionalidade poderosa sem degradar a performance nem introduzir efeitos colaterais.
7. Comparação com Abordagens Alternativas
Para apreciar melhor as vantagens do CLS, vamos comparar essa solução com algumas abordagens alternativas comumente usadas para compartilhar contexto em aplicações Node/Next:
Abordagem	Como funciona	Limitações/Problemas
Variáveis Globais	Armazena dados em escopos globais (ex: global no Node) acessíveis a todos os módulos.
Ex: global.currentUser = user durante uma request.	- Sem isolamento: Todas as requisições acessam a mesma variável, causando condições de corrida.
- Necessário gerenciar limpeza manual (risco de dado vazar para próxima request).
- Quebra escalabilidade (em cluster, globais não replicam entre processos).
Objeto de Request	Anexa informações ao próprio objeto da requisição (ou resposta) e passa adiante.
Ex: req.currentUser = user.	- Funciona apenas dentro do ciclo da request, mas requer passar req para todos os lugares ou ter acesso ao objeto (o que em arquiteturas em camadas nem sempre é viável).
- Polui o objeto Request que deveria representar dados HTTP, não contexto arbitrário.
- Em Next SSR, nem sempre temos um único req acessível em todos os níveis (ex: dentro de um React component não temos req).
Cookies ou Storage no Cliente	Grava informações no cookie HTTP (ou localStorage no browser) que são enviadas em cada requisição.
Ex: salvar um sessionId ou locale no cookie.	- Lento e visível ao cliente: Todo dado no cookie trafega na rede e pode ser lido/manipulado pelo usuário, portanto não adequado para informações sensíveis ou puramente internas (ex: não queremos expor um ID de log interno).
- Cookies aumentam o tamanho de cada requisição.
- Não serve para dados voláteis da request atual (cookies persistem entre requests). É útil para sessão, não para, por exemplo, um ID de operação temporário.
Cabeçalhos HTTP (Headers)	Transmite dados de contexto como cabeçalhos nas requisições HTTP entre serviços.
Ex: incluir um header X-Request-ID ou X-User-ID quando faz chamadas API internas.	- Manual e suscetível a erro: Você deve lembrar de enviar e propagar esses headers em cada chamada, e extrair em cada ponto necessário. O desenvolvedor precisa garantir consistência.
- Exposição externa: Se vindo do cliente, um header pode ser forjado; idealmente serviços internos deveriam gerar ou validar.
- Não resolve compartilhamento dentro do mesmo processo sem chamada HTTP. Por exemplo, entre funções de uma mesma requisição, adicionar header não se aplica – header é útil de um serviço a outro.
- Apesar das limitações, é frequentemente usado para distributed tracing (onde CLS de cada processo injeta/extrai o ID nos headers para o próximo).
Contexto explícito (params)	Passar objetos de contexto manualmente entre funções/módulos.
Ex: chamar funcao(contexto, param1) em vez de funcao(param1).	- Código verboso e acoplado: Muitas funções precisam mudar sua assinatura para aceitar um contexto a mais, mesmo que elas próprias não usem diretamente (prop drilling no backend).
- Dificulta reuso de funções em outros contextos (função fica dependendo de algo que talvez não faça sentido fora de HTTP).
- Escalabilidade ruim: conforme o projeto cresce, precisar adicionar contexto em centenas de métodos é propenso a erro e difícil de manter.
Como se observa, cada alternativa tem pontos fracos. Variáveis globais falham em concorrência; anexar em objetos ou passar parâmetros torna o código pesado e inflexível; cookies/headers servem a propósitos específicos, mas não resolvem o contexto dentro do processo de forma limpa. Já o CLS via nestjs-cls combina vantagens: fornece isolamento seguro como a passagem via parâmetro (mas de forma implícita, sem mudar as assinaturas), disponibilidade global como variáveis globais (porém restrita a cada fluxo de requisição) e não expõe dados ao cliente (tudo em memória do servidor, diferentemente de cookies/headers, exceto se você deliberadamente enviar algum valor como header). Em suma, o nestjs-cls e AsyncLocalStorage entregam uma solução equilibrada para o problema de contexto per-request no Node, evitando os trade-offs negativos das alternativas acima. Por isso, é geralmente preferível quando suportado pelo ambiente.
8. Possíveis Armadilhas e Incompatibilidades com o Next.js (e como mitigá-las)
Apesar de seus benefícios, devemos estar cientes de algumas armadilhas ao usar nestjs-cls (ou CLS em geral) em conjunto com o Next.js e sua arquitetura:
Separação de Runtime (Edge vs Node): Reforçando o ponto anterior, o Next.js possui um middleware Edge opcional que roda em V8 isolado (sem Node APIs). Se sua aplicação utiliza esse middleware (arquivo middleware.ts), não tente usar nestjs-cls dentro dele – não funcionará, pois a API AsyncLocalStorage do Node não está disponível ali. Além disso, mesmo que estivesse, a execução subsequente (no Node) não teria acesso ao mesmo contexto. Mitigação: Restringir o uso de CLS ao ambiente Node (rotas API, getServerSideProps, etc.). Caso precise passar algo do middleware edge para a etapa Node, use headers ou cookies como ponte, conforme discutido. Por exemplo, se no middleware edge você decidir qual versão do site servir (A/B testing) e quer usar essa informação no SSR, coloque um header x-variant e leia-o no Node para armazenar no contexto.
Lambdas Serverless e Escopo Global: No Vercel ou outras plataformas serverless, cada requisição é tratada em um “isolado” que começa e termina. Isso na verdade combina bem com CLS, pois garante um contexto realmente isolado por invocação. Porém, cuidado: se você espera que um valor no AsyncLocalStorage persista além da requisição, isso não vai acontecer – a função lambda termina e leva embora a memória. Isso é desejável (sem memória persistente entre requests). Apenas note que qualquer dado que precise sobreviver entre requests deve estar em outro lugar (DB, cache, etc., não no CLS). Essa não é exatamente uma armadilha, mas uma característica para ter em mente. Já em servidores tradicionais, o processo fica rodando; porém, como vimos, o design do ALS já evita persistir dados entre requests automaticamente, desde que usado corretamente.
Next.js em desenvolvimento (Hot Reload): Durante o desenvolvimento local, o Next frequentemente recompila e reseta o ambiente a cada mudança de código. Isso pode refazer instâncias e possivelmente perder contextos já que o servidor reinicia parte dele. Se você estiver testando CLS em desenvolvimento e notar comportamento estranho, pode ser simplesmente em função do hot reload. Em produção isso não ocorre. Portanto, testes de isolamento devem ser feitos preferencialmente em ambiente de produção ou simulado, não confiando 100% no ambiente dev do Next, que é um pouco diferente. Uma mitigação é rodar next start em modo produção local para validar o comportamento do CLS em situação real.
Compatibilidade com frameworks e libs de terceiros: Além dos middlewares Express que podem quebrar contexto (como vimos em boas práticas), há casos de bibliotecas que gerenciam o loop async de forma customizada. Por exemplo, ORMs mais antigas, drivers de DB ou bibliotecas de agenda de tarefas usavam ganchos internos que não conheciam AsyncLocalStorage. Atualmente, muitos já se adaptaram. O NestJS v9+ e v10 em diante inclusive citam suporte ao AsyncLocalStorage nos contextos de Request. Porém, se estiver integrando alguma ferramenta incomum, vale pesquisar por compatibilidade com AsyncLocalStorage. A documentação do nestjs-cls traz uma seção de compatibilidade mencionando, por exemplo, detalhes para GraphQL (no Apollo Server versões antigas era necessário um ajuste especial com enterWith devido a como as resolvers eram invocadas em paralelo)
papooch.github.io
papooch.github.io
. Portanto, se sua aplicação Next envolve GraphQL via Nest, revise as recomendações: usar ClsMiddleware montado manualmente ou ClsGuard no gateway, garantir idempotência ao setar valores (pode ser que um mesmo request GraphQL acione contexto múltiplas vezes)
papooch.github.io
. Em Next.js puro com GraphQL (seja via Apollo Client/Server no mesmo projeto), ainda assim a criação de contexto e os resolvers podem precisar cuidado similar.
Uso incorreto do contexto em componentes React: No Next 16, provavelmente as Server Actions (funções assíncronas anotadas que podem ser chamadas do cliente) estão estáveis. Elas rodam no servidor e portanto podem acessar o CLS. Entretanto, se tentar acessar o contexto diretamente dentro de um componente React (por exemplo, numa renderização de componente funcional), isso não é trivial pois o componente não tem acesso ao ClsService injetado. Uma saída seria utilizar as Server Actions ou usar um contexto React separado. Porém, a melhor prática é limitar o acesso ao CLS nas camadas de back-end (handlers, serviços) e passar para os componentes somente o que eles precisam via props. Ou seja, use o CLS para pegar dados e alimentar os componentes, mas não para que os componentes conheçam o CLS. Isso mantém a separação de preocupações.
Atualizações do Next e Node: O Next.js evolui rapidamente. Caso a implementação interna do Next em relação ao AsyncLocalStorage mude, é bom verificar changelogs. Por exemplo, se no Next 15 ou 16 a equipe introduziu alguma forma nativa de contexto de requisição (além dos utilitários já citados), pode ser interessante comparar com o nestjs-cls. Até onde sabemos, Next usa AsyncLocalStorage internamente mas não expõe uma API geral de request context para devs (daí a utilidade de libs como @nextwrappers/async-local-storage). Fique atento a eventuais breaking changes. Mitigação: teste seu uso de nestjs-cls quando atualizar versões major do Next ou do Node, e consulte o repositório do nestjs-cls para ver se há alguma nota de compatibilidade (a lib é mantida ativamente, ex: versão 6 suporta Nest 11 etc. e costuma documentar matrix de compatibilidade)
papooch.github.io
.
Debugging mais complexo: Uma "armadilha" conceitual do CLS é que ele obscurece um pouco o fluxo de dados. Variáveis que aparecem "magicamente" disponíveis dificultam saber de onde vêm, especialmente para novos desenvolvedores na equipe. Se não bem documentado, alguém pode se confundir ao ver this.cls.get('userId') retornando valor sem nunca ter sido passado. Isso não é um bug mas exige disciplina. Mitigação: documente as chaves usadas no contexto e em que ponto são definidas. Mantenha consistência nos nomes (evite usar a mesma chave para propósitos diferentes em lugares distintos). Utilize ferramentas de log/monitoramento para inspecionar se contextos estão sendo criados e finalizados corretamente (por exemplo, inserir temporariamente logs no início e fim do AsyncLocalStorage.run).
Consciente dessas considerações, você pode contornar os obstáculos e usufruir do nestjs-cls mesmo em um ambiente Next.js. Em resumo: use o CLS somente no Node runtime, sincronize dados Edge->Node via headers se preciso, teste com suas bibliotecas e fique de olho em mudanças de versão. Assim, as incompatibilidades poderão ser mitigadas sem grandes dores de cabeça.
9. Testes e Validações para Garantir o Funcionamento do CLS
Por fim, ao introduzir o nestjs-cls em seu projeto, é fundamental planejar testes que certifiquem que o contexto está funcionando corretamente e não introduziu regressões. Seguem sugestões de testes e práticas de validação:
Teste unitário de serviços usando ClsService: Como o ClsService é injetável, em testes unitários simples você pode mockar seu comportamento ou injetar uma instância fake. Por exemplo, para um serviço que utiliza this.cls.get('algo'), você pode fornecer nos testes um stub de ClsService cuja função get retorna um valor pré-definido. Isso permite testar a lógica do serviço sem depender do contexto real. Alternativamente, pode usar o próprio ClsService real mas chamando métodos runWith para simular o contexto (ver item sobre integração). A documentação do nestjs-cls inclusive destaca que podemos mockar ClsService em unit tests comuns
papooch.github.io
.
Testes de integração com contexto real: Para cenários envolvendo mais de um componente (ex: um interceptor e um serviço), vale usar o ClsService real. Uma técnica é envolver a chamada de teste dentro de ClsService.run ou runWith para popular o contexto e então executar o código. Por exemplo:
it('deve retornar gato do usuário do contexto', async () => {
  const expectedUserId = 42;
  // executa o método dentro de um contexto CLS que tem userId definido
  const result = await clsService.runWith<{ userId: number }, Cat>(
    { userId: expectedUserId },
    () => catService.getCatForUser()
  );
  expect(result.userId).toBe(expectedUserId);
});
No snippet acima (adaptado da documentação
papooch.github.io
), usamos clsService.runWith(store, callback) para criar um contexto com userId e chamar o serviço, verificando depois se ele utilizou corretamente o valor. Esse tipo de teste assegura que dentro do fluxo assíncrono os dados fluem como esperado.
Testes end-to-end (E2E): Monte cenários de requisição completos, seja usando ferramentas como Supertest para chamar endpoints HTTP do seu app Nest, seja testando páginas via algo como Playwright. O objetivo é verificar se múltiplas requisições simultâneas não interferem entre si:
Por exemplo, submeta duas requisições quase ao mesmo tempo, uma com header X-User-Id: 1 e outra com X-User-Id: 2. No controlador (ou resposta) de cada uma, retorne o usuário atual obtido do contexto. O teste deve confirmar que a resposta da primeira contém usuário 1 e da segunda usuário 2 – garantindo que não houve mix de contexto.
Semelhantemente, se tiver um ID de requisição no header de resposta, valide que cada resposta tem um ID distinto.
Você também pode intencionalmente introduzir esperas no código (ex.: use setTimeout dentro do handler para atrasar a finalização de uma request) e mandar outra request nesse intervalo, para simular concorrência e verificar que a segunda não pegou dados da primeira.
Teste de vazamento de memória: Em ambientes de staging ou desenvolvimento, rode um stress test – muitas requisições em paralelo – e use monitoramento de memória (heap snapshots, etc.) para assegurar que não há crescimento sustentado de uso de memória após as requisições (indicando contextos não liberados). Cada request deve liberar seu contexto ao terminar. Se notar crescimento, use ferramentas de profiling para identificar objetos persistindo; pode ser indício de algum callback pendurado ou uso incorreto de enterWith em vez de run.
Teste de compatibilidade com outros módulos: Se você adicionou nestjs-cls, por exemplo, a um módulo GraphQL ou a um micro-serviço, escreva testes para fluxos desses módulos. Ex.: para GraphQL, consultar dois campos que internamente usam o contexto e ver se ambos veem o mesmo valor que foi setado (mesmo após possivelmente passarem por dois resolvers distintos). Ou em micro-serviços (caso seu Nest use Microservices Transport), verificar se o contexto se mantém na comunicação interna. Dica: O nestjs-cls sugere que para micro-serviços ou gateways não HTTP, pode ser necessário usar ClsGuard ou outras estratégias
papooch.github.io
papooch.github.io
 – seus testes devem cobrir isso caso aplique.
Testes de funcionalidade relacionada: Por fim, adapte testes existentes da sua aplicação para levar em conta o contexto. Por exemplo, se antes você tinha um teste de login que verificava que o sistema registra um log "Usuário X logado", agora espere que o log venha prefixado com [reqId] Usuário X logado (ou como formatou). Isso garante que os lugares onde o CLS deveria impactar (como logs, ou picking up user from context) realmente estão ativos.
Validações manuais e de código: Além de testes automatizados, durante desenvolvimento, pode ser útil adicionar temporariamente logs ou asserts:
Insira um log no início de cada requisição imprimindo algo como Iniciando contexto CLS com id=${reqId} e outro no final (Finalizando contexto CLS id=${reqId}). Isso, ao acompanhar vários requests concorrentes, ajuda a verificar a separação.
Use ferramentas de linting ou análise estática para impedir usos indevidos de globais (por exemplo, considere marcar como erro atribuir em global diretamente, encorajando o time a usar CLS em vez disso).
Documente no README do projeto como inicializar corretamente o contexto no Next, para que futuros desenvolvedores não esqueçam de usar o wrapper withAsyncContext nos novos handlers.
Em resumo, testar o CLS envolve garantir isolamento e persistência corretos dos dados de contexto. Quando bem testado, você pode confiar que features como logging contextual e identificação de usuário funcionarão mesmo sob carga e em todos os cenários. E lembre-se: se encontrar algum comportamento anômalo, a comunidade Nest/Node pode ter relatado algo semelhante – não hesite em consultar fontes ou abrir uma issue no repositório do nestjs-cls (é um pacote de terceiros mantido separadamente do core do Nest
docs.nestjs.com
).
Com todos esses pontos cobrindo da visão geral aos detalhes de implementação, este PRD fornece um guia completo de como utilizar nestjs-cls em um projeto Next.js 16. Seguindo as instruções de configuração, aplicando os exemplos e atentando às boas práticas e testes recomendados, é possível colher os benefícios do Continuation-Local Storage – código mais limpo, contexto de requisição consistente e melhor capacidade de observação – sem comprometer a performance ou a arquitetura da aplicação
papooch.github.io
. Boa codificação! Referências Utilizadas:
Documentação oficial do NestJS CLS e AsyncLocalStorage
papooch.github.io
docs.nestjs.com
docs.nestjs.com
Artigo Using AsyncLocalStorage in Next.js – Rexford Essilfie
dev.to
dev.to
ZenStack – integração de NestJS CLS para Multi-tenancy
zenstack.dev
zenstack.dev
Discussões de comunidade e notas do autor do nestjs-cls sobre desempenho e segurança
papooch.github.io
papooch.github.io
Citações
Introduction | NestJS CLS

https://papooch.github.io/nestjs-cls/

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage
Introduction | NestJS CLS

https://papooch.github.io/nestjs-cls/
Introduction | NestJS CLS

https://papooch.github.io/nestjs-cls/

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8
Installation | NestJS CLS

https://papooch.github.io/nestjs-cls/introduction/installation
Quick Start | NestJS CLS

https://papooch.github.io/nestjs-cls/introduction/quick-start
Quick Start | NestJS CLS

https://papooch.github.io/nestjs-cls/introduction/quick-start

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

node.js - Issue with AsyncLocalStorage in Next.js 14: context is not being shared between middleware, handlers and SSR pages - Stack Overflow

https://stackoverflow.com/questions/78684437/issue-with-asynclocalstorage-in-next-js-14-context-is-not-being-shared-between

NestJS | ZenStack

https://zenstack.dev/docs/quick-start/nestjs
Introduction | NestJS CLS

https://papooch.github.io/nestjs-cls/
Introduction | NestJS CLS

https://papooch.github.io/nestjs-cls/

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage
Security | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/security
Security | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/security
Security | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/security
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Testing | NestJS CLS

https://papooch.github.io/nestjs-cls/testing
Testing | NestJS CLS

https://papooch.github.io/nestjs-cls/testing
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility
Compatibility | NestJS CLS

https://papooch.github.io/nestjs-cls/considerations/compatibility

Async Local Storage | NestJS - A progressive Node.js framework

https://docs.nestjs.com/recipes/async-local-storage

Using AsyncLocalStorage in Next.js ✚ ⚛️ - DEV Community

https://dev.to/rexessilfie/using-asynclocalstorage-in-nextjs-44c8

NestJS | ZenStack

https://zenstack.dev/docs/quick-start/nestjs