import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function analyzeTable() {
    const tableName = process.argv[2];
    if (!tableName) {
        console.error('❌ Por favor, especifique o nome da tabela a ser analisada.');
        console.log('   Exemplo: pnpm exec ts-node scripts/analyze-table.ts NOME_DA_TABELA');
        process.exit(1);
    }

    console.log(`📊 Analisando tabela "${tableName}"...`);

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

        // 1. Get Row Count
        const countResult = await dataSource.query(`SELECT COUNT(*) as count FROM "${tableName}"`);
        console.log(`\n1. Total de Registros: ${countResult[0].count}`);

        // 2. Get Schema
        console.log('\n2. Estrutura (Schema):');
        const schemaResult = await dataSource.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = '${tableName}'
            ORDER BY ordinal_position;
        `);
        console.table(schemaResult);

        // 3. Get Data Sample
        console.log('\n3. Amostra de Dados (5 primeiras linhas):');
        const dataSample = await dataSource.query(`SELECT * FROM "${tableName}" LIMIT 5`);
        console.table(dataSample);

    } catch (error: any) {
        console.error(`❌ Erro ao analisar a tabela "${tableName}":`, error.message);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

analyzeTable();
