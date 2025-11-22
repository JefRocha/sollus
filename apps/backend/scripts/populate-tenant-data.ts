import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function populateMultiTenantData() {
    console.log('🏢 Populando dados multi-tenant para 3 empresas...\n');

    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Array com dados das 3 empresas
        const empresas = [
            {
                id: 1,
                razaoSocial: 'SOLLUS TECNOLOGIA LTDA',
                nomeFantasia: 'SOLLUS TECH',
                cnpj: '12345678000101',
                email: 'contato@sollus.com.br'
            },
            {
                id: 2,
                razaoSocial: 'EMPRESA BETA COMERCIO LTDA',
                nomeFantasia: 'BETA COMERCIO',
                cnpj: '98765432000102',
                email: 'contato@beta.com.br'
            },
            {
                id: 3,
                razaoSocial: 'GAMMA SERVICOS E CONSULTORIA LTDA',
                nomeFantasia: 'GAMMA CONSULTORIA',
                cnpj: '11223344000103',
                email: 'contato@gamma.com.br'
            }
        ];

        for (const emp of empresas) {
            console.log(`\n📋 Criando dados para: ${emp.nomeFantasia}`);
            console.log('─'.repeat(60));

            // 1. EMPRESA
            console.log(`\n1️⃣  Inserindo EMPRESA (ID: ${emp.id})...`);
            await dataSource.query(`
        INSERT INTO EMPRESA (
          ID, RAZAO_SOCIAL, NOME_FANTASIA, CNPJ, EMAIL, 
          CODIGO_IBGE_CIDADE, CODIGO_IBGE_UF, DATA_INSC_JUNTA_COMERCIAL,
          ID_EMPRESA
        ) VALUES (
          ${emp.id}, '${emp.razaoSocial}', '${emp.nomeFantasia}', '${emp.cnpj}', '${emp.email}',
          '5300108', '53', '2020-01-01',
          ${emp.id}
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Empresa criada');

            // 2. EMPRESA_ENDERECO
            console.log(`\n2️⃣  Inserindo EMPRESA_ENDERECO...`);
            await dataSource.query(`
        INSERT INTO EMPRESA_ENDERECO (
          ID, ID_EMPRESA, LOGRADOURO, NUMERO, COMPLEMENTO, BAIRRO, 
          CIDADE, CEP, MUNICIPIO_IBGE, UF, PRINCIPAL
        ) VALUES (
          ${emp.id}, ${emp.id}, 'RUA EXEMPLO ${emp.id}', '${emp.id * 100}', 'SALA ${emp.id}', 'CENTRO',
          'BRASILIA', '7000000${emp.id}', '5300108', 'DF', 'S'
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Endereço criado');

            // 3. EMPRESA_TELEFONE
            console.log(`\n3️⃣  Inserindo EMPRESA_TELEFONE...`);
            await dataSource.query(`
        INSERT INTO EMPRESA_TELEFONE (ID, ID_EMPRESA, TIPO, NUMERO) VALUES 
          (${emp.id * 2 - 1}, ${emp.id}, '0', '061999${emp.id}00000'),
          (${emp.id * 2}, ${emp.id}, '1', '061333${emp.id}00000')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 2 telefones criados');

            // 4. CARGO
            console.log(`\n4️⃣  Inserindo CARGO...`);
            await dataSource.query(`
        INSERT INTO CARGO (ID, ID_EMPRESA, NOME, DESCRICAO, SALARIO, CBO_2002) VALUES 
          (${emp.id * 10 + 1}, ${emp.id}, 'ADMINISTRADOR', 'Administrador do Sistema', 8000, '252105'),
          (${emp.id * 10 + 2}, ${emp.id}, 'VENDEDOR', 'Vendedor', 3000, '354105'),
          (${emp.id * 10 + 3}, ${emp.id}, 'GERENTE', 'Gerente', 6000, '142105')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 3 cargos criados');

            // 5. SETOR
            console.log(`\n5️⃣  Inserindo SETOR...`);
            await dataSource.query(`
        INSERT INTO SETOR (ID, ID_EMPRESA, NOME, DESCRICAO) VALUES 
          (${emp.id * 10 + 1}, ${emp.id}, 'ADMINISTRACAO', 'Setor Administrativo'),
          (${emp.id * 10 + 2}, ${emp.id}, 'VENDAS', 'Setor de Vendas'),
          (${emp.id * 10 + 3}, ${emp.id}, 'FINANCEIRO', 'Setor Financeiro')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 3 setores criados');

            // 6. PAPEL
            console.log(`\n6️⃣  Inserindo PAPEL...`);
            await dataSource.query(`
        INSERT INTO PAPEL (ID, ID_EMPRESA, NOME, DESCRICAO) VALUES 
          (${emp.id * 10 + 1}, ${emp.id}, 'ADMINISTRADOR', 'Acesso total ao sistema'),
          (${emp.id * 10 + 2}, ${emp.id}, 'USUARIO', 'Usuário comum'),
          (${emp.id * 10 + 3}, ${emp.id}, 'VENDEDOR', 'Acesso ao módulo de vendas')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 3 papéis criados');

            // 7. PESSOA (2 pessoas por empresa: 1 PF e 1 PJ)
            console.log(`\n7️⃣  Inserindo PESSOA...`);
            const pessoaFisicaId = emp.id * 100 + 1;
            const pessoaJuridicaId = emp.id * 100 + 2;

            await dataSource.query(`
        INSERT INTO PESSOA (
          ID, ID_EMPRESA, NOME, TIPO, EMAIL, 
          EH_CLIENTE, EH_FORNECEDOR, EH_COLABORADOR, EH_TRANSPORTADORA
        ) VALUES 
          (${pessoaFisicaId}, ${emp.id}, 'JOAO SILVA ${emp.id}', 'F', 'joao${emp.id}@email.com', 'S', 'N', 'S', 'N'),
          (${pessoaJuridicaId}, ${emp.id}, 'FORNECEDOR XYZ ${emp.id} LTDA', 'J', 'contato${emp.id}@fornecedor.com', 'N', 'S', 'N', 'N')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 2 pessoas criadas (1 PF, 1 PJ)');

            // 8. PESSOA_FISICA
            console.log(`\n8️⃣  Inserindo PESSOA_FISICA...`);
            await dataSource.query(`
        INSERT INTO PESSOA_FISICA (
          ID, ID_PESSOA, ID_ESTADO_CIVIL, ID_NIVEL_FORMACAO, 
          CPF, RG, ORGAO_RG, DATA_EMISSAO_RG, DATA_NASCIMENTO, SEXO
        ) VALUES (
          ${pessoaFisicaId}, ${pessoaFisicaId}, 1, 7,
          '111111111${emp.id}1', '123456${emp.id}', 'SSP-DF', '2010-01-01', '1990-01-0${emp.id}', 'M'
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Pessoa física criada');

            // 9. PESSOA_JURIDICA
            console.log(`\n9️⃣  Inserindo PESSOA_JURIDICA...`);
            await dataSource.query(`
        INSERT INTO PESSOA_JURIDICA (
          ID, ID_PESSOA, CNPJ, NOME_FANTASIA, 
          INSCRICAO_MUNICIPAL, INSCRICAO_ESTADUAL, DATA_CONSTITUICAO, TIPO_REGIME, CRT
        ) VALUES (
          ${pessoaJuridicaId}, ${pessoaJuridicaId}, '9999999900010${emp.id}', 'FORNECEDOR ${emp.id}',
          'ISENTO', 'ISENTO', '2015-01-01', '3', '1'
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Pessoa jurídica criada');

            // 10. PESSOA_ENDERECO
            console.log(`\n🔟 Inserindo PESSOA_ENDERECO...`);
            await dataSource.query(`
        INSERT INTO PESSOA_ENDERECO (
          ID, ID_PESSOA, LOGRADOURO, NUMERO, COMPLEMENTO, BAIRRO, 
          CIDADE, CEP, MUNICIPIO_IBGE, UF, PRINCIPAL
        ) VALUES 
          (${pessoaFisicaId}, ${pessoaFisicaId}, 'RUA PESSOA ${emp.id}', '${emp.id}0', 'APT ${emp.id}', 'ASA SUL', 'BRASILIA', '7100000${emp.id}', '5300108', 'DF', 'S'),
          (${pessoaJuridicaId}, ${pessoaJuridicaId}, 'AV FORNECEDOR ${emp.id}', '${emp.id}00', 'LOJA ${emp.id}', 'TAGUATINGA', 'BRASILIA', '7200000${emp.id}', '5300108', 'DF', 'S')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 2 endereços criados');

            // 11. PESSOA_TELEFONE
            console.log(`\n1️⃣1️⃣  Inserindo PESSOA_TELEFONE...`);
            await dataSource.query(`
        INSERT INTO PESSOA_TELEFONE (ID, ID_PESSOA, TIPO, NUMERO) VALUES 
          (${pessoaFisicaId}, ${pessoaFisicaId}, '0', '061988${emp.id}00000'),
          (${pessoaJuridicaId}, ${pessoaJuridicaId}, '0', '061344${emp.id}00000')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 2 telefones criados');

            // 12. CLIENTE
            console.log(`\n1️⃣2️⃣  Inserindo CLIENTE...`);
            await dataSource.query(`
        INSERT INTO CLIENTE (ID, ID_EMPRESA, ID_PESSOA, DATA_CADASTRO) VALUES 
          (${pessoaFisicaId}, ${emp.id}, ${pessoaFisicaId}, CURRENT_DATE)
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Cliente criado');

            // 13. FORNECEDOR
            console.log(`\n1️⃣3️⃣  Inserindo FORNECEDOR...`);
            await dataSource.query(`
        INSERT INTO FORNECEDOR (ID, ID_EMPRESA, ID_PESSOA, DATA_CADASTRO) VALUES 
          (${pessoaJuridicaId}, ${emp.id}, ${pessoaJuridicaId}, CURRENT_DATE)
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Fornecedor criado');

            // 14. COLABORADOR
            console.log(`\n1️⃣4️⃣  Inserindo COLABORADOR...`);
            await dataSource.query(`
        INSERT INTO COLABORADOR (
          ID, ID_EMPRESA, ID_PESSOA, ID_CARGO, ID_SETOR, 
          MATRICULA, DATA_CADASTRO, DATA_ADMISSAO
        ) VALUES (
          ${pessoaFisicaId}, ${emp.id}, ${pessoaFisicaId}, ${emp.id * 10 + 1}, ${emp.id * 10 + 1},
          'COL${emp.id}001', CURRENT_DATE, '2023-01-01'
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Colaborador criado');

            // 15. USUARIO
            console.log(`\n1️⃣5️⃣  Inserindo USUARIO...`);
            await dataSource.query(`
        INSERT INTO USUARIO (
          ID, ID_EMPRESA, ID_COLABORADOR, ID_PAPEL, 
          LOGIN, SENHA, DATA_CADASTRO, ADMINISTRADOR
        ) VALUES (
          ${emp.id}, ${emp.id}, ${pessoaFisicaId}, ${emp.id * 10 + 1},
          'admin${emp.id}', '6512bd43d9caa6e02c990b0a82652dca', CURRENT_DATE, 'S'
        )
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Usuário admin criado (senha: 11)');

            // 16. BANCO_AGENCIA
            console.log(`\n1️⃣6️⃣  Inserindo BANCO_AGENCIA...`);
            await dataSource.query(`
        INSERT INTO BANCO_AGENCIA (ID, ID_EMPRESA, ID_BANCO, NUMERO, NOME) VALUES 
          (${emp.id}, ${emp.id}, 1, ${2900 + emp.id}, 'AGENCIA EMPRESA ${emp.id}')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ Agência bancária criada');

            // 17. BANCO_CONTA_CAIXA
            console.log(`\n1️⃣7️⃣  Inserindo BANCO_CONTA_CAIXA...`);
            await dataSource.query(`
        INSERT INTO BANCO_CONTA_CAIXA (
          ID, ID_EMPRESA, ID_BANCO_AGENCIA, NUMERO, NOME, DESCRICAO, TIPO
        ) VALUES 
          (${emp.id * 2 - 1}, ${emp.id}, ${emp.id}, '${emp.id}00000-${emp.id}', 'CONTA CORRENTE ${emp.id}', 'Conta corrente principal', 'C'),
          (${emp.id * 2}, ${emp.id}, NULL, 'CXINT${emp.id}', 'CAIXA INTERNO ${emp.id}', 'Caixa interno da empresa', 'X')
        ON CONFLICT (ID) DO NOTHING;
      `);
            console.log('   ✅ 2 contas criadas (1 CC, 1 Caixa)');

            console.log(`\n✅ Dados da empresa ${emp.nomeFantasia} criados com sucesso!`);
        }

        await dataSource.destroy();

        console.log('\n' + '='.repeat(60));
        console.log('🎉 TODOS OS DADOS MULTI-TENANT FORAM POPULADOS COM SUCESSO!');
        console.log('='.repeat(60));
        console.log('\n📊 Resumo:');
        console.log('   - 3 empresas criadas');
        console.log('   - Cada empresa com:');
        console.log('     • 1 endereço e 2 telefones');
        console.log('     • 3 cargos, 3 setores, 3 papéis');
        console.log('     • 2 pessoas (1 PF cliente/colaborador, 1 PJ fornecedor)');
        console.log('     • 1 usuário admin (login: admin1, admin2, admin3 | senha: 11)');
        console.log('     • 1 agência e 2 contas bancárias\n');

        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        console.error(error);
        process.exit(1);
    }
}

populateMultiTenantData();
