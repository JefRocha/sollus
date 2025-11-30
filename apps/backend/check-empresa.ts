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

async function checkEmpresa() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        const empresa = await dataSource.query(`
            SELECT * FROM "EMPRESA" WHERE "id" = 1
        `);

        const fs = require('fs');

        if (empresa.length > 0) {
            console.log('✅ Empresa 1 encontrada:');
            console.table(empresa);
            fs.writeFileSync('check_empresa_output.txt', JSON.stringify(empresa, null, 2));
        } else {
            console.log('❌ Empresa 1 NÃO encontrada!');

            const todasEmpresas = await dataSource.query(`SELECT * FROM "EMPRESA"`);
            console.log('📋 Empresas disponíveis:');
            console.table(todasEmpresas);
            fs.writeFileSync('check_empresa_output.txt', JSON.stringify(todasEmpresas, null, 2));
        }

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        const fs = require('fs');
        fs.writeFileSync('check_empresa_output.txt', 'Error: ' + error.message);
    } finally {
        await dataSource.destroy();
    }
}

checkEmpresa();
