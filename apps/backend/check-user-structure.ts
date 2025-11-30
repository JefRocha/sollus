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

async function checkUserStructure() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado ao banco de dados\n');

        // Check USUARIO table structure
        const usuarioColumns = await dataSource.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'USUARIO'
            ORDER BY ordinal_position
        `);

        console.log('📋 Estrutura da tabela USUARIO:');
        console.table(usuarioColumns);

        // Check users data
        const users = await dataSource.query(`SELECT * FROM "USUARIO"`);
        console.log('\n👤 Usuários cadastrados:');
        console.table(users);

        // Check if ID_COLABORADOR column exists
        const hasColaboradorColumn = usuarioColumns.some((c: any) => c.column_name === 'ID_COLABORADOR');
        console.log('\n❓ Tem coluna ID_COLABORADOR?', hasColaboradorColumn);

        if (!hasColaboradorColumn) {
            console.log('\n⚠️  PROBLEMA IDENTIFICADO: Coluna ID_COLABORADOR não existe!');
            console.log('💡 Solução: Precisamos adicionar esta coluna ou usar outra estratégia para identificar a empresa do usuário.');
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await dataSource.destroy();
    }
}

checkUserStructure();
