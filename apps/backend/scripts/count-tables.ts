import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function countTables() {
    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Count total tables
        const tables = await dataSource.query(`
      SELECT COUNT(*) as total
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        // Count tables with ID_EMPRESA
        const tablesWithEmpresa = await dataSource.query(`
      SELECT COUNT(DISTINCT table_name) as total
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND column_name = 'ID_EMPRESA'
    `);

        console.log('\n📊 **Estatísticas do Schema:**\n');
        console.log(`✅ Total de tabelas criadas: ${tables[0].total}`);
        console.log(`🏢 Tabelas com ID_EMPRESA: ${tablesWithEmpresa[0].total}`);
        console.log(`📋 Tabelas sem ID_EMPRESA: ${tables[0].total - tablesWithEmpresa[0].total}\n`);

        await dataSource.destroy();
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

countTables();
