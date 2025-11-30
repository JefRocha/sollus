import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function spotCheck() {
    const tableName = 'MUNICIPIO';
    console.log(`🕵️  Iniciando verificação por amostragem para a tabela "${tableName}"...`);

    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE || 'solluserp',
        ssl: false,
        synchronize: false,
        logging: false,
    });

    try {
        await dataSource.initialize();

        const countResult = await dataSource.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const totalRows = parseInt(countResult[0].count, 10);
        const middleOffset = Math.floor(totalRows / 2);

        const firstRow = await dataSource.query(`SELECT * FROM "${tableName}" ORDER BY "id" ASC LIMIT 1`);
        const middleRow = await dataSource.query(`SELECT * FROM "${tableName}" ORDER BY "id" ASC LIMIT 1 OFFSET ${middleOffset}`);
        const lastRow = await dataSource.query(`SELECT * FROM "${tableName}" ORDER BY "id" DESC LIMIT 1`);

        console.log('\n--- AMOSTRAS DO BANCO DE DADOS ---');
        console.log('Primeiro Registro:', JSON.stringify(firstRow[0]));
        console.log('Registro do Meio:', JSON.stringify(middleRow[0]));
        console.log('Último Registro:', JSON.stringify(lastRow[0]));
        console.log('------------------------------------');


    } catch (error: any) {
        console.error(`❌ Erro ao buscar amostras da tabela "${tableName}":`, error.message);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

spotCheck();