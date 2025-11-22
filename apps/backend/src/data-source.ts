import { DataSource } from 'typeorm';
import { configMySQL } from './orm.config';

// DataSource para migrations
export const AppDataSource = new DataSource({
    ...configMySQL,
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations_history',
} as any);
