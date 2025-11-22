import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function populateMasterData() {
  console.log('📊 Populando dados mestres...\n');

  const dataSource = new DataSource(configMySQL as any);

  try {
    await dataSource.initialize();

    // ESTADO_CIVIL
    console.log('📝 Inserindo ESTADO_CIVIL...');
    const estadosCivis = [
      ['SOLTEIRO', 'SOLTEIRO'],
      ['CASADO', 'CASADO'],
      ['VIUVO', 'VIUVO'],
      ['SEPARADO JUDICIALMENTE', 'SEPARADO JUDICIALMENTE'],
      ['DIVORCIADO', 'DIVORCIADO']
    ];

    for (const [nome, desc] of estadosCivis) {
      await dataSource.query(
        `INSERT INTO "ESTADO_CIVIL" ("NOME", "DESCRICAO") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [nome, desc]
      );
    }
    console.log('✅ 5 registros em ESTADO_CIVIL\n');

    // NIVEL_FORMACAO
    console.log('📝 Inserindo NIVEL_FORMACAO...');
    const niveisFormacao = [
      ['Analfabeto', 'Grau de instrução 1'],
      ['Até 5º Ano Incompleto', 'Grau de instrução 2'],
      ['5º Ano Completo', 'Grau de instrução 3'],
      ['6º ao 9º Ano do Fundamental', 'Grau de instrução 4'],
      ['Fundamental Completo', 'Grau de instrução 5'],
      ['Médio Incompleto', 'Grau de instrução 6'],
      ['Médio Completo', 'Grau de instrução 7'],
      ['Superior Incompleto', 'Grau de instrução 8'],
      ['Superior Completo', 'Grau de instrução 9'],
      ['Mestrado', 'Grau de instrução 10'],
      ['Doutorado', 'Grau de instrução 11'],
      ['Pós-Doutorado', '']
    ];

    for (const [nome, desc] of niveisFormacao) {
      await dataSource.query(
        `INSERT INTO "NIVEL_FORMACAO" ("NOME", "DESCRICAO") VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [nome, desc]
      );
    }
    console.log('✅ 12 registros em NIVEL_FORMACAO\n');

    // BANCO
    console.log('📝 Inserindo BANCO...');
    const bancos = [
      ['001', 'BANCO DO BRASIL S.A.', 'http://www.bb.com.br/'],
      ['104', 'CAIXA ECONÔMICA FEDERAL', 'http://www.caixa.gov.br/'],
      ['237', 'BANCO BRADESCO S.A.', 'http://www.bradesco.com.br/'],
      ['341', 'BANCO ITAÚ S.A.', 'http://www.itau.com.br/'],
      ['033', 'BANCO SANTANDER S.A.', 'http://www.santander.com.br/'],
      ['745', 'BANCO CITIBANK S.A.', 'http://www.citibank.com/brasil'],
      ['399', 'HSBC BANK BRASIL S.A.', 'http://www.hsbc.com.br/'],
      ['422', 'BANCO SAFRA S.A.', 'http://www.safra.com.br/'],
      ['070', 'BRB - BANCO DE BRASÍLIA S.A.', 'http://www.brb.com.br/'],
      ['041', 'BANCO DO ESTADO DO RIO GRANDE DO SUL S.A.', 'http://www.banrisul.com.br/']
    ];

    for (const [codigo, nome, url] of bancos) {
      await dataSource.query(
        `INSERT INTO "BANCO" ("CODIGO", "NOME", "URL") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [codigo, nome, url]
      );
    }
    console.log('✅ 10 bancos em BANCO\n');

    // CFOP
    console.log('📝 Inserindo CFOP...');
    const cfops = [
      [1000, 'ENTRADAS DO ESTADO', 'Entradas ou aquisições de serviços do estado'],
      [1101, 'Compra para industrialização', 'Compras para industrialização'],
      [1102, 'Compra para comercialização', 'Compras para comercialização'],
      [5101, 'Venda de produção', 'Venda de produção do estabelecimento'],
      [5102, 'Venda de mercadoria', 'Venda de mercadoria adquirida de terceiros'],
      [6101, 'Venda de produção interestadual', 'Venda de produção para outro estado'],
      [6102, 'Venda de mercadoria interestadual', 'Venda de mercadoria para outro estado']
    ];

    for (const [codigo, descricao, aplicacao] of cfops) {
      await dataSource.query(
        `INSERT INTO "CFOP" ("CODIGO", "DESCRICAO", "APLICACAO") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
        [codigo, descricao, aplicacao]
      );
    }
    console.log('✅ 7 CFOPs inseridos\n');

    await dataSource.destroy();

    console.log('✅ Dados mestres populados com sucesso!\n');
    process.exit(0);

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populateMasterData();
