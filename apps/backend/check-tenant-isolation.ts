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

async function checkTenantIsolation() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Check all pessoas grouped by empresa
        const pessoasByEmpresa = await dataSource.query(`
            SELECT 
                "ID_EMPRESA",
                COUNT(*) as total,
                STRING_AGG("NOME", ', ' ORDER BY "id") as nomes
            FROM "PESSOA"
            GROUP BY "ID_EMPRESA"
            ORDER BY "ID_EMPRESA"
        `);

        console.log('📊 PESSOAS por EMPRESA:');
        console.table(pessoasByEmpresa);

        // Check detailed list
        const allPessoas = await dataSource.query(`
            SELECT "id", "ID_EMPRESA", "NOME", "EMAIL"
            FROM "PESSOA"
            ORDER BY "ID_EMPRESA", "id"
        `);

        console.log('\n📋 Lista detalhada:');
        console.table(allPessoas);

        // Check user's empresa
        const users = await dataSource.query(`
            SELECT 
                u."id",
                u."LOGIN",
                c."ID_EMPRESA" as tenant_id
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);

        console.log('\n👤 Usuários e suas empresas:');
        console.table(users);

        console.log('\n⚠️  PROBLEMA:');
        console.log('   - Usuário logado tem tenant_id = 1');
        console.log('   - Frontend está mostrando pessoas de TODAS as empresas');
        console.log('   - O BaseRepository NÃO está aplicando o filtro!');
        console.log('\n🔍 Possíveis causas:');
        console.log('   1. JWT não tem o campo "tenant" correto');
        console.log('   2. TenantService não está extraindo o tenant do JWT');
        console.log('   3. BaseRepository não está sendo usado pelo PessoaService');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

checkTenantIsolation();
