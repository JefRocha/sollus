import { Client } from 'pg';

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'solluserp',
    password: 'Jr197519',
    port: 5432,
});

async function checkUsers() {
    try {
        await client.connect();
        const res = await client.query('SELECT COUNT(*) FROM "USUARIO"');
        console.log('User count:', res.rows[0].count);

        const users = await client.query('SELECT * FROM "USUARIO" LIMIT 5');
        console.log('First 5 users:', users.rows);
    } catch (err) {
        console.error('Error querying database:', err);
    } finally {
        await client.end();
    }
}

checkUsers();
