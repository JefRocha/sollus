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

async function updateEmpresaId() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Update ID 2 to Company 2
        await dataSource.query(`
            UPDATE "PESSOA" SET "ID_EMPRESA" = 2 WHERE "id" = 2
        `);
        console.log('✅ Pessoa ID 2 atualizada para Empresa 2');

        // Verify
        const pessoas = await dataSource.query(`
            SELECT "id", "NOME", "ID_EMPRESA" FROM "PESSOA"
        `);
        console.table(pessoas);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

updateEmpresaId();
