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

async function checkCounts() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        const tables = ['USUARIO', 'COLABORADOR', 'PESSOA', 'EMPRESA', 'CARGO', 'SETOR', 'PAPEL'];

        for (const table of tables) {
            try {
                const count = await dataSource.query(`SELECT COUNT(*) FROM "${table}"`);
                console.log(`${table}: ${count[0].count}`);
            } catch (e: any) {
                console.log(`${table}: ERROR - ${e.message}`);
            }
        }

        // Check specifically for User 1
        const user1 = await dataSource.query(`SELECT * FROM "USUARIO" WHERE id = 1`);
        console.log('User 1:', user1);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await dataSource.destroy();
    }
}

checkCounts();
