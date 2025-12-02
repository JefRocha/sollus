const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'Script_Dados_Postgresql.sql');
const outputFilePath = path.join(__dirname, 'Script_Dados_Postgresql_transformed.sql');

// O ID da empresa que será inserido. Altere se necessário.
const empresaId = 1;

fs.readFile(sqlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error("Erro ao ler o arquivo SQL:", err);
        return;
    }

    // Expressão regular para encontrar 'insert into nome_tabela (colunas) VALUES (valores)'
    // Esta regex é mais robusta para lidar com diferentes espaçamentos e quebras de linha.
    const insertRegex = /insert into\s+([\w_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/gi;

    const transformedData = data.replace(insertRegex, (match, tableName, columns, values) => {
        // Nomes de tabelas que devem ser ignoradas (não precisam de id_empresa)
        const ignoredTables = [
            'estado_civil',
            'nivel_formacao',
            'uf',
            'municipio',
            'empresa', // A própria tabela empresa não precisa de um id_empresa
            'papel',
            'cst_icms',
            'csosn',
            'cst_cofins',
            'cst_ipi',
            'cst_pis',
            'cfop'
        ];

        if (ignoredTables.includes(tableName.toLowerCase())) {
            return match; // Retorna o 'INSERT' original se a tabela deve ser ignorada
        }

        // Adiciona a coluna id_empresa
        const newColumns = `id_empresa, ${columns}`;

        // Adiciona o valor do empresaId
        const newValues = `${empresaId}, ${values}`;

        return `insert into ${tableName} (${newColumns}) VALUES (${newValues})`;
    });

    fs.writeFile(outputFilePath, transformedData, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error("Erro ao escrever o novo arquivo SQL:", writeErr);
            return;
        }
        console.log(`Arquivo transformado com sucesso e salvo em: ${outputFilePath}`);
    });
});
