import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkTableSchema() {
    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Check ESTADO_CIVIL columns
        const estadoCivilColumns = await dataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ESTADO_CIVIL' 
      ORDER BY ordinal_position;
    `);

        console.log('\n📋 Colunas da tabela ESTADO_CIVIL:');
        console.table(estadoCivilColumns);

        await dataSource.destroy();
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

checkTableSchema();
