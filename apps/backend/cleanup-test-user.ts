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

async function cleanupTestUser() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // Find the test user pessoa (ID 5 - "Usuário 2")
        const testPessoa = await dataSource.query(`
            SELECT * FROM "PESSOA" WHERE "NOME" = 'Usuário 2'
        `);

        if (testPessoa.length === 0) {
            console.log('✅ Nenhum usuário de teste encontrado.');
            return;
        }

        console.log('🔍 Encontrado usuário de teste:');
        console.table(testPessoa);

        const pessoaId = testPessoa[0].id;

        // Find associated colaborador
        const colaborador = await dataSource.query(`
            SELECT * FROM "COLABORADOR" WHERE "ID_PESSOA" = ${pessoaId}
        `);

        if (colaborador.length > 0) {
            const colaboradorId = colaborador[0].id;
            console.log(`\n🔧 Deletando colaborador ${colaboradorId}...`);

            // Delete colaborador (this will cascade to usuario if configured)
            await dataSource.query(`
                DELETE FROM "COLABORADOR" WHERE "id" = ${colaboradorId}
            `);
            console.log('✅ Colaborador deletado');
        }

        // Delete pessoa
        console.log(`\n🔧 Deletando pessoa ${pessoaId}...`);
        await dataSource.query(`
            DELETE FROM "PESSOA" WHERE "id" = ${pessoaId}
        `);
        console.log('✅ Pessoa deletada');

        // Verify
        console.log('\n✅ RESULTADO FINAL:');
        const remaining = await dataSource.query(`
            SELECT "id", "NOME", "EMAIL" FROM "PESSOA" WHERE "ID_EMPRESA" = 1 ORDER BY "id"
        `);
        console.table(remaining);

        console.log('\n🎉 Limpeza concluída! Recarregue a página de Pessoas no frontend.');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        console.error(error);
    } finally {
        await dataSource.destroy();
    }
}

cleanupTestUser();
