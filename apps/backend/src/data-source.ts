import { DataSource } from 'typeorm';
import { dbConfig } from './orm.config';

// DataSource para migrations
export const AppDataSource = new DataSource({
    ...dbConfig,
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations_history',
} as any);
