import * as fs from 'fs';
import * as path from 'path';

const SQL_FILE_PATH = path.join(__dirname, '../scripts/Script_Dados_Postgresql.sql');

function refactorSqlFile() {
    try {
        let content = fs.readFileSync(SQL_FILE_PATH, 'utf8');
        let originalContent = content;

        // 1. Lowercase all "quoted" identifiers and remove quotes
        // Ex: "NOME_DA_COLUNA" -> nome_da_coluna
        content = content.replace(/"([A-Z_]+)"/g, (match, p1) => p1.toLowerCase());

        // 2. Lowercase all INSERT INTO table names
        // Ex: INSERT INTO NOME_DA_TABELA -> insert into nome_da_tabela
        content = content.replace(/(INSERT INTO\s+)([A-Z_]+)/g, (match, p1, p2) => p1.toLowerCase() + p2.toLowerCase());

        if (content !== originalContent) {
            fs.writeFileSync(SQL_FILE_PATH, content, 'utf8');
            console.log(`Refatorado: ${path.basename(SQL_FILE_PATH)}`);
        } else {
            console.log(`Nenhuma alteração necessária para: ${path.basename(SQL_FILE_PATH)}`);
        }
    } catch (error) {
        console.error(`Erro ao processar o arquivo ${SQL_FILE_PATH}:`, error);
    }
}

console.log('Iniciando refatoração do script SQL...');
refactorSqlFile();
console.log('Refatoração do script SQL concluída.');
