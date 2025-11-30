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

async function createRefreshTokenTable() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado ao banco de dados');

        // Check if table exists
        const tableExists = await dataSource.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'REFRESH_TOKEN'
            );
        `);

        if (tableExists[0].exists) {
            console.log('⚠️  Tabela REFRESH_TOKEN já existe. Dropando...');
            await dataSource.query('DROP TABLE "REFRESH_TOKEN" CASCADE');
        }

        console.log('🔨 Criando tabela REFRESH_TOKEN...');

        await dataSource.query(`
            CREATE TABLE "REFRESH_TOKEN" (
                "id" SERIAL PRIMARY KEY,
                "TOKEN" VARCHAR(255) NOT NULL UNIQUE,
                "ID_USUARIO" INTEGER NOT NULL,
                "EXPIRES_AT" TIMESTAMP NOT NULL,
                "IS_REVOKED" BOOLEAN NOT NULL DEFAULT false,
                "CREATED_AT" TIMESTAMP NOT NULL DEFAULT NOW(),
                "LAST_ACTIVITY_AT" TIMESTAMP NOT NULL DEFAULT NOW(),
                CONSTRAINT "FK_REFRESH_TOKEN_USUARIO" 
                    FOREIGN KEY ("ID_USUARIO") 
                    REFERENCES "USUARIO"("id") 
                    ON DELETE CASCADE
            )
        `);

        console.log('✅ Tabela REFRESH_TOKEN criada com sucesso!');

        // Verify structure
        const columns = await dataSource.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'REFRESH_TOKEN'
            ORDER BY ordinal_position
        `);

        console.log('\n📋 Estrutura da tabela:');
        console.table(columns);

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await dataSource.destroy();
    }
}

createRefreshTokenTable();
