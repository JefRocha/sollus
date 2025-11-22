import { DataSource } from 'typeorm';
import { configMySQL } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function checkSchema() {
    console.log('🔍 Verificando schema do banco de dados...\n');

    const dataSource = new DataSource(configMySQL as any);

    try {
        await dataSource.initialize();

        // Listar todas as tabelas
        const tables = await dataSource.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

        console.log(`📋 Tabelas criadas (${tables.length}):\n`);

        for (const table of tables) {
            console.log(`  ✅ ${table.table_name} (${table.column_count} colunas)`);

            // Verificar se tem ID_EMPRESA
            const hasEmpresa = await dataSource.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = $1 
          AND column_name = 'ID_EMPRESA'
      `, [table.table_name]);

            if (hasEmpresa.length > 0) {
                console.log(`      🏢 Tem ID_EMPRESA`);
            }
        }

        // Verificar migrations executadas
        console.log('\n📜 Migrations executadas:');
        const migrations = await dataSource.query(`
      SELECT * FROM migrations_history ORDER BY timestamp DESC
    `);

        if (migrations.length > 0) {
            migrations.forEach((m: any) => {
                console.log(`  ✅ ${m.name} (${new Date(parseInt(m.timestamp)).toLocaleString()})`);
            });
        } else {
            console.log('  ⚠️  Nenhuma migration registrada');
        }

        await dataSource.destroy();
        console.log('\n✅ Verificação concluída!');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

checkSchema();
