import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function dropAllTables() {
    console.log('🗑️  Limpando banco de dados...\n');

    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Drop all tables
        await dataSource.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);

        console.log('✅ Todas as tabelas foram removidas!');

        await dataSource.destroy();
        console.log('\n✅ Banco limpo com sucesso!');
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

dropAllTables();
