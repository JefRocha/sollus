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

async function fixTenantIsolation() {
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

        console.log('📊 Usuários:');
        console.table(users);

        // 2. Fix users without empresa
        for (const user of users) {
            if (!user.empresa_id) {
                console.log(`\n🔧 Corrigindo usuário ${user.LOGIN}...`);

                // Create a new colaborador for this user
                const newColab = await dataSource.query(`
                    INSERT INTO "COLABORADOR" ("ID_EMPRESA", "ID_PESSOA")
                    VALUES (1, 1)
                    RETURNING "id"
                `);

                const colaboradorId = newColab[0].id;
                console.log(`  ✅ Colaborador ${colaboradorId} criado`);

                // Link user to new colaborador
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
                u."id",
                u."LOGIN",
                c."id" as colab_id,
                c."ID_EMPRESA" as tenant_id
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);
        console.table(final);

        const allHaveTenant = final.every((u: any) => u.tenant_id);
        if (allHaveTenant) {
            console.log('\n🎉 SUCESSO! Todos os usuários têm tenant_id (empresa) associado!');
            console.log('💡 Agora faça logout e login novamente para o JWT ser regenerado com o tenant correto.');
        } else {
            console.log('\n⚠️  Ainda há usuários sem tenant!');
        }

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

fixTenantIsolation();
