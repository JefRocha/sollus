import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'solluserp',
    synchronize: false,
    logging: false,
});

async function debugRestore() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        // 1. Try to insert EMPRESA (Exact SQL from file)
        console.log('\nAttempting to insert EMPRESA 1 (File SQL)...');
        try {
            await dataSource.query(`
                INSERT INTO EMPRESA (id, "RAZAO_SOCIAL", "NOME_FANTASIA", "CNPJ", "INSCRICAO_ESTADUAL", "INSCRICAO_MUNICIPAL", "INSCRICAO_JUNTA_COMERCIAL", "DATA_INSC_JUNTA_COMERCIAL", "TIPO", "EMAIL", "CODIGO_IBGE_CIDADE", "CODIGO_IBGE_UF") 
                VALUES (1, 'EMPRESA MATRIZ PARA TESTES', 'EMPRESA PARA TESTES', '00000000000191', NULL, NULL, NULL, '2009-11-19', NULL, 'testes@empresateste.com', '5300108', '53')
            `);
            console.log('✅ EMPRESA 1 inserted successfully');
        } catch (e: any) {
            console.error('❌ Error inserting EMPRESA:', e.message);
            if (e.detail) console.error('Detail:', e.detail);
            if (e.column) console.error('Column:', e.column);
        }

        // 2. Try to insert PESSOA (Exact SQL from file)
        console.log('\nAttempting to insert PESSOA 1 (File SQL)...');
        try {
            await dataSource.query(`
                INSERT INTO PESSOA (id, "ID_EMPRESA", "NOME", "TIPO", "EMAIL", "SITE", "EH_CLIENTE", "EH_FORNECEDOR", "EH_COLABORADOR", "EH_TRANSPORTADORA") 
                VALUES ('1', 1, 'TESTE PESSOA FISICA','F','pf@gmail.com',NULL,'S','S','S','S')
            `);
            console.log('✅ PESSOA 1 inserted successfully');
        } catch (e: any) {
            console.error('❌ Error inserting PESSOA:', e.message);
            if (e.detail) console.error('Detail:', e.detail);
            if (e.column) console.error('Column:', e.column);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
    } finally {
        await dataSource.destroy();
    }
}

debugRestore();
