import { MigrationInterface, QueryRunner } from "typeorm";

export class RecreateViewsPostgres20251208223000 implements MigrationInterface {
    name = 'RecreateViewsPostgres20251208223000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // View Pessoa Fornecedor
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_fornecedor"`);
        await queryRunner.query(`
            CREATE OR REPLACE VIEW "view_pessoa_fornecedor" AS
            SELECT
                f."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pf."cpf" AS "cpf_cnpj",
                pf."rg" AS "rg_ie",
                f."desde" AS "desde",
                f."data_cadastro" AS "data_cadastro",
                f."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa"
            FROM
                "pessoa" p
                INNER JOIN "pessoa_fisica" pf ON pf."id_pessoa" = p."id"
                INNER JOIN "fornecedor" f ON f."id_pessoa" = p."id"
                INNER JOIN "pessoa_endereco" e ON e."id_pessoa" = p."id"
            WHERE
                p."eh_fornecedor" = 'S' AND e."principal" = 'S'
            UNION
            SELECT
                f."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pj."cnpj" AS "cpf_cnpj",
                pj."inscricao_estadual" AS "rg_ie",
                f."desde" AS "desde",
                f."data_cadastro" AS "data_cadastro",
                f."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa"
            FROM
                "pessoa" p
                INNER JOIN "pessoa_juridica" pj ON pj."id_pessoa" = p."id"
                INNER JOIN "fornecedor" f ON f."id_pessoa" = p."id"
                INNER JOIN "pessoa_endereco" e ON e."id_pessoa" = p."id"
            WHERE
                p."eh_fornecedor" = 'S' AND e."principal" = 'S'
        `);

        // View Pessoa Transportadora
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_transportadora"`);
        await queryRunner.query(`
            CREATE OR REPLACE VIEW "view_pessoa_transportadora" AS
            SELECT
                t."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pf."cpf" AS "cpf_cnpj",
                pf."rg" AS "rg_ie",
                t."data_cadastro" AS "data_cadastro",
                t."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa"
            FROM
                "pessoa" p
                INNER JOIN "pessoa_fisica" pf ON pf."id_pessoa" = p."id"
                INNER JOIN "transportadora" t ON t."id_pessoa" = p."id"
                INNER JOIN "pessoa_endereco" e ON e."id_pessoa" = p."id"
            WHERE
                p."eh_transportadora" = 'S' AND e."principal" = 'S'
            UNION
            SELECT
                t."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pj."cnpj" AS "cpf_cnpj",
                pj."inscricao_estadual" AS "rg_ie",
                t."data_cadastro" AS "data_cadastro",
                t."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa"
            FROM
                "pessoa" p
                INNER JOIN "pessoa_juridica" pj ON pj."id_pessoa" = p."id"
                INNER JOIN "transportadora" t ON t."id_pessoa" = p."id"
                INNER JOIN "pessoa_endereco" e ON e."id_pessoa" = p."id"
            WHERE
                p."eh_transportadora" = 'S' AND e."principal" = 'S'
        `);

        // View Pessoa Colaborador
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_colaborador"`);
        await queryRunner.query(`
            CREATE OR REPLACE VIEW "view_pessoa_colaborador" AS
            SELECT 
                c."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pf."cpf" AS "cpf_cnpj",
                pf."rg" AS "rg_ie",
                c."matricula" AS "matricula",
                c."data_cadastro" AS "data_cadastro",
                c."data_admissao" AS "data_admissao",
                c."data_demissao" AS "data_demissao",
                c."ctps_numero" AS "ctps_numero",
                c."ctps_serie" AS "ctps_serie",
                c."ctps_data_expedicao" AS "ctps_data_expedicao",
                c."ctps_uf" AS "ctps_uf",
                c."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa",
                c."id_cargo" AS "id_cargo",
                c."id_setor" AS "id_setor"
            FROM
                "pessoa" p 
                INNER JOIN "pessoa_fisica" pf ON (pf."id_pessoa" = p."id")
                INNER JOIN "colaborador" c ON (c."id_pessoa" = p."id")
                INNER JOIN "pessoa_endereco" e ON (e."id_pessoa" = p."id")
            WHERE 
                p."eh_colaborador" = 'S' AND e."principal" = 'S'
            UNION
            SELECT 
                c."id" AS "id",
                p."nome" AS "nome",
                p."tipo" AS "tipo",
                p."email" AS "email",
                p."site" AS "site",
                pj."cnpj" AS "cpf_cnpj",
                pj."inscricao_estadual" AS "rg_ie",
                c."matricula" AS "matricula",
                c."data_cadastro" AS "data_cadastro",
                c."data_admissao" AS "data_admissao",
                c."data_demissao" AS "data_demissao",
                c."ctps_numero" AS "ctps_numero",
                c."ctps_serie" AS "ctps_serie",
                c."ctps_data_expedicao" AS "ctps_data_expedicao",
                c."ctps_uf" AS "ctps_uf",
                c."observacao" AS "observacao",
                e."logradouro" AS "logradouro",
                e."numero" AS "numero",
                e."complemento" AS "complemento",
                e."bairro" AS "bairro",
                e."cidade" AS "cidade",
                e."cep" AS "cep",
                e."municipio_ibge" AS "municipio_ibge",
                e."uf" AS "uf",
                p."id" AS "id_pessoa",
                c."id_cargo" AS "id_cargo",
                c."id_setor" AS "id_setor"
            FROM
                "pessoa" p 
                INNER JOIN "pessoa_juridica" pj ON (pj."id_pessoa" = p."id")
                INNER JOIN "colaborador" c ON (c."id_pessoa" = p."id")
                INNER JOIN "pessoa_endereco" e ON (e."id_pessoa" = p."id")
            WHERE 
                p."eh_colaborador" = 'S' AND e."principal" = 'S'
        `);

        // View Pessoa Vendedor
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_vendedor"`);
        await queryRunner.query(`
            CREATE OR REPLACE VIEW "view_pessoa_vendedor" AS
            SELECT 
                c."id" AS "id",
                p."nome" AS "nome", p."tipo" AS "tipo", p."email" AS "email", p."site" AS "site", 
                pf."cpf" AS "cpf_cnpj", 
                pf."rg" AS "rg_ie",
                c."matricula" AS "matricula",
                c."data_cadastro" AS "data_cadastro",
                c."data_admissao" AS "data_admissao",
                c."data_demissao" AS "data_demissao",
                c."ctps_numero" AS "ctps_numero",
                c."ctps_serie" AS "ctps_serie",
                c."ctps_data_expedicao" AS "ctps_data_expedicao",
                c."ctps_uf" AS "ctps_uf",
                c."observacao" AS "observacao",
                e."logradouro" AS "logradouro", e."numero" AS "numero", e."complemento" AS "complemento", e."bairro" AS "bairro", e."cidade" AS "cidade", e."cep" AS "cep", e."municipio_ibge" AS "municipio_ibge", e."uf" AS "uf",
                p."id" AS "id_pessoa",
                c."id_cargo" AS "id_cargo",
                c."id_setor" AS "id_setor",
                v."comissao" AS "comissao",
                v."meta_venda" AS "meta_venda"
            FROM
                "pessoa" p 
                INNER JOIN "pessoa_fisica" pf ON (pf."id_pessoa" = p."id")
                INNER JOIN "colaborador" c ON (c."id_pessoa" = p."id")
                INNER JOIN "pessoa_endereco" e ON (e."id_pessoa" = p."id")
                INNER JOIN "vendedor" v ON (v."id_colaborador" = c."id")
            WHERE 
                p."eh_colaborador" = 'S' AND e."principal" = 'S'
            UNION
            SELECT 
                c."id" AS "id",
                p."nome" AS "nome", p."tipo" AS "tipo", p."email" AS "email", p."site" AS "site", 
                pj."cnpj" AS "cpf_cnpj", 
                pj."inscricao_estadual" AS "rg_ie",
                c."matricula" AS "matricula",
                c."data_cadastro" AS "data_cadastro",
                c."data_admissao" AS "data_admissao",
                c."data_demissao" AS "data_demissao",
                c."ctps_numero" AS "ctps_numero",
                c."ctps_serie" AS "ctps_serie",
                c."ctps_data_expedicao" AS "ctps_data_expedicao",
                c."ctps_uf" AS "ctps_uf",
                c."observacao" AS "observacao",
                e."logradouro" AS "logradouro", e."numero" AS "numero", e."complemento" AS "complemento", e."bairro" AS "bairro", e."cidade" AS "cidade", e."cep" AS "cep", e."municipio_ibge" AS "municipio_ibge", e."uf" AS "uf",
                p."id" AS "id_pessoa",
                c."id_cargo" AS "id_cargo",
                c."id_setor" AS "id_setor",
                v."comissao" AS "comissao",
                v."meta_venda" AS "meta_venda"
            FROM
                "pessoa" p 
                INNER JOIN "pessoa_juridica" pj ON (pj."id_pessoa" = p."id")
                INNER JOIN "colaborador" c ON (c."id_pessoa" = p."id")
                INNER JOIN "pessoa_endereco" e ON (e."id_pessoa" = p."id")
                INNER JOIN "vendedor" v ON (v."id_colaborador" = c."id")
            WHERE 
                p."eh_colaborador" = 'S' AND e."principal" = 'S'
        `);

        // View Pessoa Usuario
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_usuario"`);
        await queryRunner.query(`
            CREATE OR REPLACE VIEW "view_pessoa_usuario" AS
            SELECT 
                CAST(CONCAT(pe."id", c."id", u."id") AS BIGINT) AS "id", 
                pe."id" AS "id_pessoa", 
                pe."nome" AS "pessoa_nome", 
                pe."tipo" AS "tipo", 
                pe."email" AS "email",
                c."id" AS "id_colaborador",  
                u."id" AS "id_usuario", 
                u."login" AS "login", 
                u."senha" AS "senha", 
                u."data_cadastro" AS "data_cadastro", 
                u."administrador" AS "administrador"
            FROM 
                "pessoa" pe
                INNER JOIN "colaborador" c ON (c."id_pessoa" = pe."id")
                INNER JOIN "usuario" u ON (u."id_colaborador" = c."id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_usuario"`);
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_vendedor"`);
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_colaborador"`);
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_transportadora"`);
        await queryRunner.query(`DROP VIEW IF EXISTS "view_pessoa_fornecedor"`);
    }
}
