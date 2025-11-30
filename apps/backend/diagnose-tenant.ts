import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

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

async function diagnose() {
    const output: string[] = [];

    try {
        await dataSource.initialize();
        output.push('=== DIAGNÓSTICO MULTI-TENANCY ===\n');

        // Check users with colaborador and empresa
        const users = await dataSource.query(`
            SELECT 
                u."id",
                u."LOGIN",
                u."ID_COLABORADOR",
                c."ID_EMPRESA" as empresa_id
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c."id"
        `);

        output.push('USUÁRIOS:');
        users.forEach((u: any) => {
            output.push(`  ID: ${u.id}, Login: ${u.LOGIN}, Colaborador: ${u.ID_COLABORADOR}, Empresa: ${u.empresa_id || 'NULL'}`);
        });

        // Check if any user is missing empresa
        const usersWithoutEmpresa = users.filter((u: any) => !u.empresa_id);
        if (usersWithoutEmpresa.length > 0) {
            output.push(`\n⚠️  PROBLEMA: ${usersWithoutEmpresa.length} usuário(s) sem empresa!`);

            // Try to fix
            output.push('\n🔧 Tentando corrigir...');

            // Get first colaborador from empresa 1
            const colab = await dataSource.query(`
                SELECT "id" FROM "COLABORADOR" WHERE "ID_EMPRESA" = 1 LIMIT 1
            `);

            if (colab.length > 0) {
                for (const user of usersWithoutEmpresa) {
                    await dataSource.query(`
                        UPDATE "USUARIO" SET "ID_COLABORADOR" = ${colab[0].id} WHERE "id" = ${user.id}
                    `);
                    output.push(`  ✅ Usuário ${user.LOGIN} associado ao colaborador ${colab[0].id}`);
                }
            } else {
                output.push('  ❌ Nenhum colaborador encontrado na empresa 1');
            }
        } else {
            output.push('\n✅ Todos os usuários têm empresa associada!');
        }

        const result = output.join('\n');
        console.log(result);
        fs.writeFileSync('tenant-diagnosis.txt', result);
        console.log('\n📄 Resultado salvo em: tenant-diagnosis.txt');

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
    } finally {
        await dataSource.destroy();
    }
}

diagnose();
