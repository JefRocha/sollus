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
        ssl: false,
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

            const alterTableCommands = [
                'ALTER TABLE "NCM" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "MUNICIPIO" ALTER COLUMN "CODIGO_RECEITA_FEDERAL" DROP NOT NULL',
                'ALTER TABLE "MUNICIPIO" ALTER COLUMN "CODIGO_ESTADUAL" DROP NOT NULL',
                'ALTER TABLE "MUNICIPIO" DROP CONSTRAINT IF EXISTS "REL_d36ef1c4ef4b692d07336a137c"',
                'ALTER TABLE "PESSOA" ALTER COLUMN "SITE" DROP NOT NULL',
                'ALTER TABLE "PESSOA" ALTER COLUMN "EH_CONTADOR" DROP NOT NULL',
                'ALTER TABLE "PESSOA_ENDERECO" ALTER COLUMN "ENTREGA" DROP NOT NULL',
                'ALTER TABLE "PESSOA_ENDERECO" ALTER COLUMN "COBRANCA" DROP NOT NULL',
                'ALTER TABLE "PESSOA_ENDERECO" ALTER COLUMN "CORRESPONDENCIA" DROP NOT NULL',
                'ALTER TABLE "PESSOA_FISICA" ALTER COLUMN "RACA" DROP NOT NULL',
                'ALTER TABLE "PESSOA_FISICA" ALTER COLUMN "NACIONALIDADE" DROP NOT NULL',
                'ALTER TABLE "PESSOA_FISICA" ALTER COLUMN "NATURALIDADE" DROP NOT NULL',
                'ALTER TABLE "PESSOA_FISICA" ALTER COLUMN "NOME_PAI" DROP NOT NULL',
                'ALTER TABLE "PESSOA_FISICA" ALTER COLUMN "NOME_MAE" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "INSCRICAO_ESTADUAL" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "INSCRICAO_MUNICIPAL" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "TIPO_REGIME" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "CRT" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "SITE" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "CONTATO" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "DATA_CONSTITUICAO" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "INSCRICAO_JUNTA_COMERCIAL" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "CEI" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "CODIGO_CNAE_PRINCIPAL" DROP NOT NULL',
                'ALTER TABLE "EMPRESA" ALTER COLUMN "TIPO" DROP NOT NULL',
                'ALTER TABLE "EMPRESA_ENDERECO" ALTER COLUMN "ENTREGA" DROP NOT NULL',
                'ALTER TABLE "EMPRESA_ENDERECO" ALTER COLUMN "COBRANCA" DROP NOT NULL',
                'ALTER TABLE "EMPRESA_ENDERECO" ALTER COLUMN "CORRESPONDENCIA" DROP NOT NULL',
                'ALTER TABLE "CARGO" ALTER COLUMN "DESCRICAO" DROP NOT NULL',
                'ALTER TABLE "CARGO" ALTER COLUMN "CBO_1994" DROP NOT NULL',
                'ALTER TABLE "SETOR" ALTER COLUMN "DESCRICAO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "MATRICULA" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "DATA_CADASTRO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "DATA_ADMISSAO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "DATA_DEMISSAO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "CTPS_NUMERO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "CTPS_SERIE" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "CTPS_DATA_EXPEDICAO" DROP NOT NULL',
                'ALTER TABLE "CLIENTE" ALTER COLUMN "DESDE" DROP NOT NULL',
                'ALTER TABLE "CLIENTE" ALTER COLUMN "DATA_CADASTRO" DROP NOT NULL',
                'ALTER TABLE "CLIENTE" ALTER COLUMN "TAXA_DESCONTO" DROP NOT NULL',
                'ALTER TABLE "CLIENTE" ALTER COLUMN "LIMITE_CREDITO" DROP NOT NULL',
                'ALTER TABLE "CLIENTE" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "FORNECEDOR" ALTER COLUMN "DESDE" DROP NOT NULL',
                'ALTER TABLE "FORNECEDOR" ALTER COLUMN "DATA_CADASTRO" DROP NOT NULL',
                'ALTER TABLE "FORNECEDOR" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "CONTADOR" ALTER COLUMN "CRC_UF" DROP NOT NULL',
                'ALTER TABLE "BANCO" ALTER COLUMN "CODIGO" DROP NOT NULL',
                'ALTER TABLE "BANCO" ALTER COLUMN "URL" DROP NOT NULL',
                'ALTER TABLE "BANCO_AGENCIA" ALTER COLUMN "DIGITO" DROP NOT NULL',
                'ALTER TABLE "BANCO_AGENCIA" ALTER COLUMN "TELEFONE" DROP NOT NULL',
                'ALTER TABLE "BANCO_AGENCIA" ALTER COLUMN "CONTATO" DROP NOT NULL',
                'ALTER TABLE "BANCO_AGENCIA" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "BANCO_AGENCIA" ALTER COLUMN "GERENTE" DROP NOT NULL',
                'ALTER TABLE "BANCO_CONTA_CAIXA" ALTER COLUMN "DIGITO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "CODIGO_INTERNO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "DESCRICAO" DROP NOT NULL',
                'ALTER TABLE "CST_ICMS" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "CST_COFINS" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_COFINS" ALTER COLUMN "ALIQUOTA_UNIDADE" DROP NOT NULL',
                'ALTER TABLE "CST_IPI" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "ALIQUOTA_PORCENTO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "PORCENTO_BASE_CALCULO" DROP NOT NULL',
                'ALTER TABLE "CST_PIS" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_PIS" ALTER COLUMN "ALIQUOTA_UNIDADE" DROP NOT NULL',
                'ALTER TABLE "FIN_STATUS_PARCELA" ALTER COLUMN "PROCEDIMENTO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_OPERACAO_FISCAL" ALTER COLUMN "CFOP" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_ICMS_CUSTOM_CAB" ALTER COLUMN "ORIGEM_MERCADORIA" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_ICMS_UF" ALTER COLUMN "CSOSN" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_ICMS_CUSTOM_DET" ALTER COLUMN "CSOSN" DROP NOT NULL',
                'ALTER TABLE "COMPRA_TIPO_REQUISICAO" ALTER COLUMN "DESCRICAO" DROP NOT NULL',
                'ALTER TABLE "COMPRA_TIPO_PEDIDO" ALTER COLUMN "DESCRICAO" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "CTPS_UF" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "CODIGO_NCM" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "GTIN" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_COFINS" ALTER COLUMN "VALOR_PRECO_MAXIMO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_ICMS_UF" ALTER COLUMN "MODALIDADE_BC_ST" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "ALIQUOTA_UNidade" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_PIS" ALTER COLUMN "VALOR_PRECO_MAXIMO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_ICMS_CUSTOM_DET" ALTER COLUMN "MODALIDADE_BC_ST" DROP NOT NULL',
                'ALTER TABLE "COLABORADOR" ALTER COLUMN "OBSERVACAO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "DATA_CADASTRO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "ESTOQUE_MINIMO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "VALOR_VENDA" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_COFINS" ALTER COLUMN "VALOR_PAUTA_FISCAL" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "ALIQUOTA_UNIDADE" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_PIS" ALTER COLUMN "VALOR_PAUTA_FISCAL" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "ESTOQUE_MAXIMO" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "VALOR_PRECO_MAXIMO" DROP NOT NULL',
                'ALTER TABLE "PRODUTO" ALTER COLUMN "QUANTIDADE_ESTOQUE" DROP NOT NULL',
                'ALTER TABLE "TRIBUT_IPI" ALTER COLUMN "VALOR_PAUTA_FISCAL" DROP NOT NULL',
            ];

            console.log('🔧 Aplicando ajustes de schema necessários...');
            for (const command of alterTableCommands) {
                try {
                    await dataSource.query(command);
                } catch (e: any) {
                    // Ignore errors, e.g., if column/table doesn't exist or was already altered
                }
            }
            console.log('👍 Ajustes de schema finalizados.');

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
            console.warn('⚠️ Não foi possível aplicar todos os ajustes de schema (talvez falte permissão). Seguindo normal...');
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
                const inserts = currentStatement.split(/(?=INSERT\s)/gi);

                for (const singleInsert of inserts) {
                    const trimmedInsert = singleInsert.trim();

                    if (!trimmedInsert.toUpperCase().startsWith('INSERT')) {
                        continue;
                    }

                    let statementToExecute = trimmedInsert.endsWith(';') ? trimmedInsert : trimmedInsert + ';';

                    // Fix 1: Quote table name
                    let fixedStatement = statementToExecute.replace(/INSERT\s+(?:INTO\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?\s*\(/i, 'INSERT INTO "$1" (');

                    // Fix 2: Quote column names with special handling for ID
                    fixedStatement = fixedStatement.replace(/\(([^)]+)\)\s+VALUES/i, (match, columnList) => {
                        if (columnList.includes('"')) {
                            return match; // Already quoted, do nothing
                        }
                        const columns = columnList.split(',').map(c => {
                            const trimmed = c.trim();
                            // Special case for the primary key, which is likely 'id' in the DB
                            if (trimmed.toUpperCase() === 'ID') {
                                return `"id"`;
                            }
                            // For all other columns, preserve original case from the file
                            return `"${trimmed}"`;
                        });
                        return `(${columns.join(', ')}) VALUES`;
                    });

                    // Fix 3: Truncate decimal values for integer columns
                    fixedStatement = fixedStatement.replace(/'(\d+\.\d+)'/g, (match, numberString) => {
                        return parseInt(numberString, 10).toString();
                    });

                    try {
                        await dataSource.query(fixedStatement);
                        count++;
                    } catch (error: any) {
                        if (error.code === '23505') {
                            // Duplicate key - ignore
                        } else {
                            console.error(`❌ Erro na linha ~${lineCount} em: [${fixedStatement.substring(0, 120)}...]: ${error.message}`);
                            errorCount++;
                        }
                    }
                }
                
                if (count > 0 && count % 500 < inserts.length) {
                    console.log(`✅ ${count} comandos executados (Até a linha ~${lineCount})`);
                }

                currentStatement = '';
            }
        }

        // Process any remaining statements in the buffer after the loop finishes
        if (currentStatement.trim()) {
            console.log('⚡ Processando buffer final de comandos...');
            const inserts = currentStatement.split(/(?=INSERT\s)/gi);

            for (const singleInsert of inserts) {
                const trimmedInsert = singleInsert.trim();

                if (!trimmedInsert.toUpperCase().startsWith('INSERT')) {
                    continue;
                }

                let statementToExecute = trimmedInsert.endsWith(';') ? trimmedInsert : trimmedInsert + ';';

                // Fix 1: Quote table name
                let fixedStatement = statementToExecute.replace(/INSERT\s+(?:INTO\s+)?[`"]?([a-zA-Z0-9_]+)[`"]?\s*\(/i, 'INSERT INTO "$1" (');

                // Fix 2: Quote column names with special handling for ID
                fixedStatement = fixedStatement.replace(/\(([^)]+)\)\s+VALUES/i, (match, columnList) => {
                    if (columnList.includes('"')) {
                        return match; // Already quoted, do nothing
                    }
                    const columns = columnList.split(',').map(c => {
                        const trimmed = c.trim();
                        // Special case for the primary key, which is likely 'id' in the DB
                        if (trimmed.toUpperCase() === 'ID') {
                            return `"id"`;
                        }
                        // For all other columns, preserve original case from the file
                        return `"${trimmed}"`;
                    });
                    return `(${columns.join(', ')}) VALUES`;
                });

                // Fix 3: Truncate decimal values for integer columns
                fixedStatement = fixedStatement.replace(/'(\d+\.\d+)'/g, (match, numberString) => {
                    return parseInt(numberString, 10).toString();
                });

                try {
                    await dataSource.query(fixedStatement);
                    count++;
                } catch (error: any) {
                    if (error.code === '23505') {
                        // Duplicate key - ignore
                    } else {
                        console.error(`❌ Erro no buffer final: [${fixedStatement.substring(0, 120)}...]: ${error.message}`);
                        errorCount++;
                    }
                }
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
