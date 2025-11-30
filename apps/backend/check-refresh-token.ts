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

async function checkRefreshToken() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        // Check REFRESH_TOKEN table structure
        const columns = await dataSource.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'REFRESH_TOKEN'
            ORDER BY ordinal_position
        `);

        console.log('\nREFRESH_TOKEN columns:');
        console.table(columns);

        // Check if LAST_ACTIVITY_AT exists
        const hasLastActivity = columns.find((c: any) => c.column_name === 'LAST_ACTIVITY_AT');
        console.log('\nHas LAST_ACTIVITY_AT?', !!hasLastActivity);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await dataSource.destroy();
    }
}

checkRefreshToken();
