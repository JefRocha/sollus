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

async function checkUserTenant() {
    try {
        await dataSource.initialize();
        console.log('✅ Conectado ao banco de dados\n');

        // Check users
        const users = await dataSource.query(`
            SELECT 
                u.id,
                u.login,
                u."ID_COLABORADOR",
                c.id as colaborador_id,
                c."ID_EMPRESA" as colaborador_empresa_id,
                e.id as empresa_id,
                e."RAZAO_SOCIAL"
            FROM "USUARIO" u
            LEFT JOIN "COLABORADOR" c ON u."ID_COLABORADOR" = c.id
            LEFT JOIN "EMPRESA" e ON c."ID_EMPRESA" = e.id
            ORDER BY u.id
        `);

        console.log('📋 Usuários e suas empresas:');
        console.table(users);

        // Check pessoas
        const pessoas = await dataSource.query(`
            SELECT id, "ID_EMPRESA", "NOME", "EH_COLABORADOR"
            FROM "PESSOA"
            WHERE "EH_COLABORADOR" = 'S'
            ORDER BY id
        `);

        console.log('\n👥 Pessoas marcadas como colaboradores:');
        console.table(pessoas);

        // Check colaboradores
        const colaboradores = await dataSource.query(`
            SELECT id, "ID_PESSOA", "ID_EMPRESA"
            FROM "COLABORADOR"
            ORDER BY id
        `);

        console.log('\n💼 Colaboradores cadastrados:');
        console.table(colaboradores);

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await dataSource.destroy();
    }
}

checkUserTenant();
