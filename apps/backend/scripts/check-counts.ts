import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkCounts() {
    console.log('📊 Verificando contagem de registros...');

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

        // Check NCM table
        try {
            const ncmResult = await dataSource.query('SELECT COUNT(*) as count FROM "NCM"');
            console.log(`- Tabela "NCM": ${ncmResult[0].count} registros.`);
        } catch (e: any) {
            console.error('❌ Erro ao contar registros em "NCM":', e.message);
        }

        // Check CNAE table
        try {
            const cnaeResult = await dataSource.query('SELECT COUNT(*) as count FROM "CNAE"');
            console.log(`- Tabela "CNAE": ${cnaeResult[0].count} registros.`);
        } catch (e: any) {
            console.error('❌ Erro ao contar registros em "CNAE". Verificando nome da tabela...');
            // If CNAE fails, maybe the table name is different. Let's find it.
            const cnaeTables = await dataSource.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name ILIKE '%cnae%'
            `);
            if (cnaeTables.length > 0) {
                console.log('   -> Encontrei tabelas parecidas:', cnaeTables.map(t => t.table_name).join(', '));
            } else {
                console.log('   -> Não encontrei nenhuma tabela com "cnae" no nome.');
            }
        }

    } catch (error) {
        console.error('❌ Erro fatal ao conectar ao banco:', error);
    } finally {
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
    }
}

checkCounts();
