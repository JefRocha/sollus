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

async function fixUserTenant() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado ao banco de dados\n');

        // 1. Check current state
        console.log('📊 Estado atual:');
        const currentState = await dataSource.query(`
            SELECT 
                u."id" as user_id,
                u."LOGIN" as login,
                u."ID_COLABORADOR",
                u."ID_PAPEL",
                c."id" as colab_id,
                c."ID_EMPRESA" as colab_empresa,
                c."ID_PESSOA" as colab_pessoa
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);
        console.table(currentState);

        // 2. Check colaboradores
        console.log('\n💼 Colaboradores disponíveis:');
        const colaboradores = await dataSource.query(`
            SELECT 
                c."id",
                c."ID_PESSOA",
                c."ID_EMPRESA",
                p."NOME"
            FROM "COLABORADOR" c
            LEFT JOIN "PESSOA" p ON c."ID_PESSOA" = p."id"
        `);
        console.table(colaboradores);

        // 3. Check pessoas
        console.log('\n👥 Pessoas (colaboradores):');
        const pessoas = await dataSource.query(`
            SELECT "id", "ID_EMPRESA", "NOME", "EH_COLABORADOR"
            FROM "PESSOA"
            WHERE "EH_COLABORADOR" = 'S'
        `);
        console.table(pessoas);

        // 4. Fix: Se usuário não tem ID_COLABORADOR, vamos criar/associar
        const usersWithoutColab = currentState.filter((u: any) => !u.ID_COLABORADOR);

        if (usersWithoutColab.length > 0) {
            console.log('\n⚠️  Usuários sem colaborador:', usersWithoutColab.length);
            console.log('💡 Vou associar cada usuário a um colaborador da empresa 1...\n');

            for (const user of usersWithoutColab) {
                // Busca ou cria colaborador para este usuário
                let colaborador = colaboradores.find((c: any) => c.ID_EMPRESA === 1);

                if (colaborador) {
                    console.log(`✅ Associando usuário ${user.login} ao colaborador ${colaborador.id}`);
                    await dataSource.query(`
                        UPDATE "USUARIO" 
                        SET "ID_COLABORADOR" = ${colaborador.id}
                        WHERE id = ${user.user_id}
                    `);
                } else {
                    console.log(`❌ Nenhum colaborador encontrado para empresa 1`);
                }
            }
        }

        // 5. Verify fix
        console.log('\n✅ Estado após correção:');
        const finalState = await dataSource.query(`
            SELECT 
                u."id" as user_id,
                u."LOGIN" as login,
                u."ID_COLABORADOR",
                c."ID_EMPRESA" as tenant_id
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);
        console.table(finalState);

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await dataSource.destroy();
    }
}

fixUserTenant();
