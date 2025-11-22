import { DataSource, DataSourceOptions } from 'typeorm';
import { configMySQL } from '../src/orm.config';

async function testConnection() {
    console.log('🔍 Testando conexão com PostgreSQL...\n');

    const config = configMySQL as DataSourceOptions;

    console.log('Configuração:');
    console.log(`  Host: ${(config as any).host}`);
    console.log(`  Port: ${(config as any).port}`);
    console.log(`  Database: ${(config as any).database}`);
    console.log(`  Username: ${(config as any).username}\n`);

    const dataSource = new DataSource(config);

    try {
        await dataSource.initialize();
        console.log('✅ Conexão estabelecida com sucesso!');

        // Testar query simples
        const result = await dataSource.query('SELECT version()');
        console.log(`\n📊 PostgreSQL Version: ${result[0].version}\n`);

        // Listar tabelas existentes
        const tables = await dataSource.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

        if (tables.length > 0) {
            console.log(`📋 Tabelas existentes (${tables.length}):`);
            tables.forEach((t: any) => console.log(`  - ${t.tablename}`));
        } else {
            console.log('📋 Nenhuma tabela encontrada (banco vazio)');
        }

        await dataSource.destroy();
        console.log('\n✅ Teste concluído com sucesso!');
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro ao conectar ao banco de dados:\n');
        console.error(error.message);
        console.error('\n💡 Verifique:');
        console.error('  1. PostgreSQL está rodando?');
        console.error('  2. Banco de dados "solluserp" existe?');
        console.error('  3. Credenciais no .env estão corretas?');
        console.error('  4. Firewall/porta 5432 está acessível?');
        process.exit(1);
    }
}

testConnection();
