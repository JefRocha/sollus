import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewPessoaCliente20251208221128
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove a tabela criada incorretamente na migration inicial, se existir
    await queryRunner.query(`DROP TABLE IF EXISTS "VIEW_PESSOA_CLIENTE"`);
    // Remove a view se já existir, para garantir uma criação limpa
    await queryRunner.query(`DROP VIEW IF EXISTS "VIEW_PESSOA_CLIENTE"`);

    await queryRunner.query(`
            CREATE OR REPLACE VIEW "VIEW_PESSOA_CLIENTE" AS
            SELECT 
                C."ID" AS "id",
                P."NOME" AS "NOME", 
                P."TIPO" AS "TIPO", 
                P."EMAIL" AS "EMAIL", 
                P."SITE" AS "SITE", 
                PF."CPF" AS "CPF_CNPJ", 
                PF."RG" AS "RG_IE",
                C."DESDE" AS "DESDE",
                C."TAXA_DESCONTO" AS "TAXA_DESCONTO",
                C."LIMITE_CREDITO" AS "LIMITE_CREDITO",
                C."DATA_CADASTRO" AS "DATA_CADASTRO",
                C."OBSERVACAO" AS "OBSERVACAO",
                E."LOGRADOURO" AS "LOGRADOURO", 
                E."NUMERO" AS "NUMERO", 
                E."COMPLEMENTO" AS "COMPLEMENTO", 
                E."BAIRRO" AS "BAIRRO", 
                E."CIDADE" AS "CIDADE", 
                E."CEP" AS "CEP", 
                E."MUNICIPIO_IBGE" AS "MUNICIPIO_IBGE", 
                E."UF" AS "UF",
                P."ID" as "ID_PESSOA"
            FROM
                "PESSOA" P 
                INNER JOIN "PESSOA_FISICA" PF ON (PF."ID_PESSOA" = P."ID")
                INNER JOIN "CLIENTE" C ON (C."ID_PESSOA" = P."ID")
                INNER JOIN "PESSOA_ENDERECO" E ON (E."ID_PESSOA" = P."ID")
            WHERE 
                P."EH_CLIENTE" = 'S' AND E."PRINCIPAL" = 'S'

            UNION

            SELECT 
                C."ID" AS "id",
                P."NOME" AS "NOME", 
                P."TIPO" AS "TIPO", 
                P."EMAIL" AS "EMAIL", 
                P."SITE" AS "SITE", 
                PJ."CNPJ" AS "CPF_CNPJ", 
                PJ."INSCRICAO_ESTADUAL" AS "RG_IE",
                C."DESDE" AS "DESDE",
                C."TAXA_DESCONTO" AS "TAXA_DESCONTO",
                C."LIMITE_CREDITO" AS "LIMITE_CREDITO",
                C."DATA_CADASTRO" AS "DATA_CADASTRO",
                C."OBSERVACAO" AS "OBSERVACAO",
                E."LOGRADOURO" AS "LOGRADOURO", 
                E."NUMERO" AS "NUMERO", 
                E."COMPLEMENTO" AS "COMPLEMENTO", 
                E."BAIRRO" AS "BAIRRO", 
                E."CIDADE" AS "CIDADE", 
                E."CEP" AS "CEP", 
                E."MUNICIPIO_IBGE" AS "MUNICIPIO_IBGE", 
                E."UF" AS "UF",
                P."ID" as "ID_PESSOA"
            FROM
                "PESSOA" P 
                INNER JOIN "PESSOA_JURIDICA" PJ ON (PJ."ID_PESSOA" = P."ID")
                INNER JOIN "CLIENTE" C ON (C."ID_PESSOA" = P."ID")
                INNER JOIN "PESSOA_ENDERECO" E ON (E."ID_PESSOA" = P."ID")
            WHERE 
                P."EH_CLIENTE" = 'S' AND E."PRINCIPAL" = 'S';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS "VIEW_PESSOA_CLIENTE"`);
  }
}
