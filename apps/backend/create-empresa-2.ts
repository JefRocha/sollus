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

async function createEmpresa2() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Check if Empresa 2 exists
        const empresa2 = await dataSource.query(`SELECT * FROM "EMPRESA" WHERE "id" = 2`);

        if (empresa2.length === 0) {
            console.log('Creating Empresa 2...');

            const empresa1 = await dataSource.query(`SELECT * FROM "EMPRESA" WHERE "id" = 1`);
            if (empresa1.length > 0) {
                const e1 = empresa1[0];
                // Use only columns that we know exist
                await dataSource.query(`
                    INSERT INTO "EMPRESA" ("id", "RAZAO_SOCIAL", "NOME_FANTASIA", "CNPJ", "TIPO", "EMAIL")
                    VALUES (2, 'EMPRESA TESTE 2', 'TESTE 2', '00000000000200', '${e1.TIPO || 'M'}', '${e1.EMAIL || 'teste@teste.com'}')
                `);
                console.log('✅ Empresa 2 criada.');
            } else {
                throw new Error('Empresa 1 not found to copy from');
            }
        } else {
            console.log('ℹ️ Empresa 2 já existe.');
        }

        // Update Pessoa 2 to Empresa 2
        await dataSource.query(`
            UPDATE "PESSOA" SET "ID_EMPRESA" = 2 WHERE "id" = 2
        `);
        console.log('✅ Pessoa ID 2 atualizada para Empresa 2');

        // Verify
        const pessoas = await dataSource.query(`
            SELECT "id", "NOME", "ID_EMPRESA" FROM "PESSOA"
        `);

        const output = JSON.stringify(pessoas, null, 2);
        console.log('📋 Pessoas e seus ID_EMPRESA:', output);

        const fs = require('fs');
        fs.writeFileSync('create_empresa_output.txt', output);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        const fs = require('fs');
        fs.writeFileSync('create_empresa_output.txt', 'Error: ' + error.message);
    } finally {
        await dataSource.destroy();
    }
}

createEmpresa2();
