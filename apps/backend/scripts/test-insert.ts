import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function populateMasterData() {
    console.log('📊 Populando dados mestres...\n');

    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Test simple insert first
        console.log('📝 Testando insert simples...');
        try {
            await dataSource.query(`
        INSERT INTO "ESTADO_CIVIL" (id, nome, descricao) VALUES 
          (1, 'SOLTEIRO', 'SOLTEIRO')
        ON CONFLICT (id) DO NOTHING;
      `);
            console.log('✅ Teste com minúsculas funcionou!\n');
        } catch (e1) {
            console.log('❌ Minúsculas falharam, tentando maiúsculas...');
            try {
                await dataSource.query(`
          INSERT INTO ESTADO_CIVIL (ID, NOME, DESCRICAO) VALUES 
            (1, 'SOLTEIRO', 'SOLTEIRO')
          ON CONFLICT (ID) DO NOTHING;
        `);
                console.log('✅ Teste com maiúsculas sem aspas funcionou!\n');
            } catch (e2) {
                console.log('❌ Maiúsculas sem aspas falharam, tentando com aspas...');
                await dataSource.query(`
          INSERT INTO "ESTADO_CIVIL" VALUES 
            (DEFAULT, 'SOLTEIRO', 'SOLTEIRO')
        `);
                console.log('✅ Teste com DEFAULT funcionou!\n');
            }
        }

        await dataSource.destroy();
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro final:', error.message);
        console.error('Detalhes:', error);
        process.exit(1);
    }
}

populateMasterData();
