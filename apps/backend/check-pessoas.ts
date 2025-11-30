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

async function checkPessoas() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Check all pessoas
        const pessoas = await dataSource.query(`
            SELECT 
                "id",
                "ID_EMPRESA",
                "NOME",
                "TIPO",
                "EMAIL",
                "EH_COLABORADOR"
            FROM "PESSOA"
            ORDER BY "id"
        `);

        console.log('📋 Todas as PESSOAS no banco:');
        console.table(pessoas);

        // Check which ones are from empresa 1
        const pessoasEmpresa1 = pessoas.filter((p: any) => p.ID_EMPRESA === 1);
        console.log(`\n✅ Pessoas da empresa 1: ${pessoasEmpresa1.length}`);
        console.table(pessoasEmpresa1);

        // Check JWT tenant
        console.log('\n💡 O filtro multi-tenancy deveria mostrar apenas as 3 primeiras pessoas (IDs 1, 2, 3)');
        console.log('   Mas está mostrando também a pessoa ID 5 (Usuário 2)');
        console.log('\n🔍 Verificando se o BaseRepository está filtrando corretamente...');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

checkPessoas();
