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

async function debugTenantFilter() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // 1. Check all pessoas in database
        const allPessoas = await dataSource.query(`
            SELECT "id", "ID_EMPRESA", "NOME", "EMAIL"
            FROM "PESSOA"
            ORDER BY "id"
        `);

        console.log('📊 TODAS as pessoas no banco (sem filtro):');
        console.table(allPessoas);

        // 2. Check what the frontend is seeing (empresa 1 only)
        const empresa1Pessoas = await dataSource.query(`
            SELECT "id", "ID_EMPRESA", "NOME", "EMAIL"
            FROM "PESSOA"
            WHERE "ID_EMPRESA" = 1
            ORDER BY "id"
        `);

        console.log('\n🔍 Pessoas da EMPRESA 1 (o que deveria aparecer no frontend):');
        console.table(empresa1Pessoas);

        // 3. Check if there's a pessoa with ID 5
        const pessoa5 = await dataSource.query(`
            SELECT * FROM "PESSOA" WHERE "id" = 5
        `);

        if (pessoa5.length > 0) {
            console.log('\n⚠️  PROBLEMA IDENTIFICADO:');
            console.log('   Existe uma pessoa com ID 5 no banco:');
            console.table(pessoa5);
            console.log(`   Empresa: ${pessoa5[0].ID_EMPRESA}`);

            if (pessoa5[0].ID_EMPRESA === 1) {
                console.log('\n   ✅ Esta pessoa PERTENCE à empresa 1, então está correto aparecer!');
                console.log('   💡 O filtro multi-tenancy ESTÁ FUNCIONANDO corretamente.');
            } else {
                console.log('\n   ❌ Esta pessoa NÃO pertence à empresa 1!');
                console.log('   🐛 O filtro multi-tenancy NÃO está funcionando!');
            }
        } else {
            console.log('\n✅ Não existe pessoa com ID 5 no banco.');
            console.log('🐛 Mas ela aparece no frontend - cache ou problema de sincronização?');
        }

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

debugTenantFilter();
