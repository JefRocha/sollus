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

async function checkEmpresaId() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        const pessoas = await dataSource.query(`
            SELECT "id", "NOME", "ID_EMPRESA" FROM "PESSOA"
        `);

        const output = JSON.stringify(pessoas, null, 2);
        console.log('📋 Pessoas e seus ID_EMPRESA:', output);

        const fs = require('fs');
        fs.writeFileSync('check_output.txt', output);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        const fs = require('fs');
        fs.writeFileSync('check_output.txt', 'Error: ' + error.message);
    } finally {
        await dataSource.destroy();
    }
}

checkEmpresaId();
