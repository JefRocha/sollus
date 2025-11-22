import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        console.log('\n📋 Verificando schema das tabelas...\n');

        // Check ESTADO_CIVIL
        const ecCols = await dataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'ESTADO_CIVIL' 
      ORDER BY ordinal_position;
    `);
        console.log('ESTADO_CIVIL:');
        ecCols.forEach((col: any) => console.log(`  - ${col.column_name} (${col.data_type})`));

        // Check BANCO
        const bancoCols = await dataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'BANCO' 
      ORDER BY ordinal_position;
    `);
        console.log('\nBANCO:');
        bancoCols.forEach((col: any) => console.log(`  - ${col.column_name} (${col.data_type})`));

        // Check EMPRESA
        const empCols = await dataSource.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'EMPRESA' 
      ORDER BY ordinal_position;
    `);
        console.log('\nEMPRESA:');
        empCols.forEach((col: any) => console.log(`  - ${col.column_name} (${col.data_type})`));

        await dataSource.destroy();
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

checkSchema();
