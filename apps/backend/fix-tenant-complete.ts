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

async function fixTenantComplete() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado\n');

        // 1. Check current state
        const users = await dataSource.query(`
            SELECT 
                u."id",
                u."LOGIN",
                u."ID_COLABORADOR",
                c."ID_EMPRESA" as empresa_id
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);

        console.log('📊 Usuários atuais:');
        console.table(users);

        // 2. Fix users without empresa
        for (const user of users) {
            if (!user.empresa_id) {
                console.log(`\n🔧 Corrigindo usuário ${user.LOGIN} (ID: ${user.id})...`);

                // Step 1: Create a new PESSOA for this user
                const newPessoa = await dataSource.query(`
                    INSERT INTO "PESSOA" ("ID_EMPRESA", "NOME", "TIPO", "EMAIL", "EH_CLIENTE", "EH_FORNECEDOR", "EH_COLABORADOR", "EH_TRANSPORTADORA", "EH_CONTADOR")
                    VALUES (1, 'Usuário ${user.LOGIN}', 'F', 'user${user.id}@sistema.com', 'N', 'N', 'S', 'N', 'N')
                    RETURNING "id"
                `);
                const pessoaId = newPessoa[0].id;
                console.log(`  ✅ Pessoa ${pessoaId} criada`);

                // Step 2: Create a new COLABORADOR linked to this PESSOA
                const newColab = await dataSource.query(`
                    INSERT INTO "COLABORADOR" ("ID_EMPRESA", "ID_PESSOA")
                    VALUES (1, ${pessoaId})
                    RETURNING "id"
                `);
                const colaboradorId = newColab[0].id;
                console.log(`  ✅ Colaborador ${colaboradorId} criado`);

                // Step 3: Link USER to new COLABORADOR
                await dataSource.query(`
                    UPDATE "USUARIO"
                    SET "ID_COLABORADOR" = ${colaboradorId}
                    WHERE "id" = ${user.id}
                `);
                console.log(`  ✅ Usuário ${user.LOGIN} associado ao colaborador ${colaboradorId}`);
            }
        }

        // 3. Verify
        console.log('\n✅ RESULTADO FINAL:');
        const final = await dataSource.query(`
            SELECT 
                u."id" as user_id,
                u."LOGIN",
                c."id" as colab_id,
                c."ID_EMPRESA" as tenant_id,
                p."NOME" as pessoa_nome
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
            LEFT JOIN "PESSOA" p ON c."ID_PESSOA" = p."id"
        `);
        console.table(final);

        const allHaveTenant = final.every((u: any) => u.tenant_id);
        if (allHaveTenant) {
            console.log('\n🎉 SUCESSO! Todos os usuários têm tenant_id (empresa 1) associado!');
            console.log('\n💡 PRÓXIMOS PASSOS:');
            console.log('   1. Faça LOGOUT no frontend');
            console.log('   2. Faça LOGIN novamente');
            console.log('   3. O JWT será regenerado com o tenant correto');
            console.log('   4. O filtro multi-tenancy funcionará automaticamente!');
        } else {
            console.log('\n⚠️  Ainda há usuários sem tenant!');
        }

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        console.error(error);
    } finally {
        await dataSource.destroy();
    }
}

fixTenantComplete();
