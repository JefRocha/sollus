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

async function setEmpresaNull() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Try to set ID_EMPRESA to NULL for ID 2
        await dataSource.query(`
            UPDATE "PESSOA" SET "ID_EMPRESA" = NULL WHERE "id" = 2
        `);
        console.log('✅ Pessoa ID 2 atualizada para ID_EMPRESA = NULL');

        // Verify
        const pessoas = await dataSource.query(`
            SELECT "id", "NOME", "ID_EMPRESA" FROM "PESSOA"
        `);

        const output = JSON.stringify(pessoas, null, 2);
        console.log('📋 Pessoas:', output);

        const fs = require('fs');
        fs.writeFileSync('update_null_output.txt', output);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        const fs = require('fs');
        fs.writeFileSync('update_null_output.txt', 'Error: ' + error.message);
    } finally {
        await dataSource.destroy();
    }
}

setEmpresaNull();
