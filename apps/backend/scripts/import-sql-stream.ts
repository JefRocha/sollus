import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

dotenv.config();

async function importSqlStream() {
    console.log('🚀 Iniciando importação OTIMIZADA (Stream)...');

    // Criar configuração do DataSource diretamente
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
    await dataSource.initialize();

    const sqlFilePath = process.env.SQL_FILE_PATH || './scripts/Script_Dados_Postgresql.sql';

    try {
        // Tentar desabilitar FKs e Triggers para agilizar e evitar erros de ordem
        try {
            await dataSource.query("SET session_replication_role = 'replica';");
            console.log('⚡ Modo de replicação ativado (FKs/Triggers desabilitados temporariamente).');

            // Fix NCM schema
            await dataSource.query('ALTER TABLE "NCM" ALTER COLUMN "OBSERVACAO" DROP NOT NULL');
            console.log('🔧 Schema da tabela NCM ajustado (OBSERVACAO nullable).');

            // Fix MUNICIPIO schema
            await dataSource.query('ALTER TABLE "MUNICIPIO" ALTER COLUMN "CODIGO_RECEITA_FEDERAL" DROP NOT NULL');
            await dataSource.query('ALTER TABLE "MUNICIPIO" ALTER COLUMN "CODIGO_ESTADUAL" DROP NOT NULL');
            // Remove unique constraint on ID_UF (fix OneToOne -> ManyToOne)
            await dataSource.query('ALTER TABLE "MUNICIPIO" DROP CONSTRAINT IF EXISTS "REL_d36ef1c4ef4b692d07336a137c"');
            console.log('🔧 Schema da tabela MUNICIPIO ajustado (CODIGOS nullable, UNIQUE removido).');

            // Create CBO table if missing
            await dataSource.query(`
                CREATE TABLE IF NOT EXISTS "CBO" (
                    "id" SERIAL PRIMARY KEY,
                    "CODIGO" VARCHAR(255),
                    "NOME" VARCHAR(255),
                    "OBSERVACAO" TEXT
                )
            `);
            console.log('🔧 Tabela CBO criada (se não existia).');

        } catch (e) {
            console.warn('⚠️ Não foi possível ativar modo de replicação (talvez falte permissão de superuser). Seguindo normal...');
        }

        const fileStream = fs.createReadStream(sqlFilePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let currentStatement = '';
        let count = 0;
        let errorCount = 0;
        let lineCount = 0;

        for await (const line of rl) {
            lineCount++;
            const trimmedLine = line.trim();

            if (!trimmedLine || trimmedLine.startsWith('--') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
                continue;
            }

            currentStatement += line + '\n';

            if (trimmedLine.endsWith(';')) {
                // Fix table names case sensitivity by adding quotes
                // Matches: INSERT INTO TableName (
                const fixedStatement = currentStatement.replace(/INSERT INTO\s+([a-zA-Z0-9_]+)\s*\(/gi, 'INSERT INTO "$1" (');

                try {
                    await dataSource.query(fixedStatement);
                    count++;
                    if (count % 500 === 0) {
                        console.log(`✅ ${count} comandos executados (Linha ${lineCount})`);
                    }
                } catch (error: any) {
                    if (error.code === '23505') {
                        // Duplicate key - ignore
                    } else {
                        console.error(`❌ Erro na linha ${lineCount}: ${error.message}`);
                        errorCount++;
                    }
                }
                currentStatement = '';
            }
        }

        // Restaurar triggers/FKs
        try {
            await dataSource.query("SET session_replication_role = 'origin';");
            console.log('🔒 Modo de replicação desativado (FKs/Triggers reabilitados).');
        } catch (e) {
            console.warn('⚠️ Erro ao restaurar modo de replicação:', e);
        }

        console.log('\n🔄 Atualizando sequências das tabelas...');
        const tables = await dataSource.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);

        for (const table of tables) {
            const tableName = table.table_name;
            try {
                const hasId = await dataSource.query(`
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = '${tableName}' AND column_name = 'id'
                `);

                if (hasId.length > 0) {
                    await dataSource.query(`
                        SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE(MAX(id), 1)) FROM "${tableName}";
                    `);
                }
            } catch (e) {
                // Ignore
            }
        }

        console.log('\n🎉 Importação finalizada!');
        console.log(`   Total inserido: ${count}`);
        console.log(`   Erros: ${errorCount}`);

    } catch (error: any) {
        console.error('❌ Erro fatal:', error);
    } finally {
        await dataSource.destroy();
    }
}

importSqlStream();
