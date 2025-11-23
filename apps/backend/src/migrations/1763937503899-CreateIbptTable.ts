import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIbptTable1763937503899 implements MigrationInterface {
    name = 'CreateIbptTable1763937503899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela IBPT
        await queryRunner.query(`CREATE TABLE "IBPT" (
            "id" SERIAL NOT NULL,
            "NCM" character varying(8),
            "EX" character(2),
            "TIPO" character(1),
            "DESCRICAO" text,
            "NACIONAL_FEDERAL" numeric(18,6),
            "IMPORTADOS_FEDERAL" numeric(18,6),
            "ESTADUAL" numeric(18,6),
            "MUNICIPAL" numeric(18,6),
            "VIGENCIA_INICIO" date,
            "VIGENCIA_FIM" date,
            "CHAVE" character varying(6),
            "VERSAO" character varying(6),
            "FONTE" character varying(34),
            CONSTRAINT "PK_IBPT" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`ALTER TABLE "BANCO" DROP CONSTRAINT "FK_9fc7eba07123ca65f089763eb0f"`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP CONSTRAINT "FK_ba39a81c12606deedf32688fde5"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP CONSTRAINT "FK_6b77cb86182930d0f0831630a98"`);
        await queryRunner.query(`ALTER TABLE "BANCO" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" DROP COLUMN "DATA_PAGAMENTO"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" ADD "DATA_PAGAMENTO" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "AUDITORIA" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" DROP CONSTRAINT "FK_6e0c2f406ba7a07198ace4191a1"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" DROP CONSTRAINT "REL_6e0c2f406ba7a07198ace4191a"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" DROP CONSTRAINT "FK_b9ec3f5173865e50f09d196fa8d"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" DROP CONSTRAINT "REL_b9ec3f5173865e50f09d196fa8"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" ADD CONSTRAINT "FK_da8cfee9ab777904bfb49413240" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" ADD CONSTRAINT "FK_6e0c2f406ba7a07198ace4191a1" FOREIGN KEY ("ID_BANCO") REFERENCES "BANCO"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" ADD CONSTRAINT "FK_8af0c35520e998339787085ae90" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" ADD CONSTRAINT "FK_b9ec3f5173865e50f09d196fa8d" FOREIGN KEY ("ID_BANCO_AGENCIA") REFERENCES "BANCO_AGENCIA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD CONSTRAINT "FK_6b77cb86182930d0f0831630a98" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "AUDITORIA" ADD CONSTRAINT "FK_9c21bee12bef3c3ccb6361a26f8" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD CONSTRAINT "FK_ba39a81c12606deedf32688fde5" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP CONSTRAINT "FK_ba39a81c12606deedf32688fde5"`);
        await queryRunner.query(`ALTER TABLE "AUDITORIA" DROP CONSTRAINT "FK_9c21bee12bef3c3ccb6361a26f8"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP CONSTRAINT "FK_6b77cb86182930d0f0831630a98"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" DROP CONSTRAINT "FK_b9ec3f5173865e50f09d196fa8d"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" DROP CONSTRAINT "FK_8af0c35520e998339787085ae90"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" DROP CONSTRAINT "FK_6e0c2f406ba7a07198ace4191a1"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" DROP CONSTRAINT "FK_da8cfee9ab777904bfb49413240"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" ADD CONSTRAINT "REL_b9ec3f5173865e50f09d196fa8" UNIQUE ("ID_BANCO_AGENCIA")`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" ADD CONSTRAINT "FK_b9ec3f5173865e50f09d196fa8d" FOREIGN KEY ("ID_BANCO_AGENCIA") REFERENCES "BANCO_AGENCIA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" ADD CONSTRAINT "REL_6e0c2f406ba7a07198ace4191a" UNIQUE ("ID_BANCO")`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" ADD CONSTRAINT "FK_6e0c2f406ba7a07198ace4191a1" FOREIGN KEY ("ID_BANCO") REFERENCES "BANCO"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "AUDITORIA" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" DROP COLUMN "DATA_PAGAMENTO"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "BANCO_CONTA_CAIXA" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "BANCO_AGENCIA" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" ADD "DATA_PAGAMENTO" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "BANCO" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD CONSTRAINT "FK_6b77cb86182930d0f0831630a98" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD CONSTRAINT "FK_ba39a81c12606deedf32688fde5" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BANCO" ADD CONSTRAINT "FK_9fc7eba07123ca65f089763eb0f" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // Remover tabela IBPT
        await queryRunner.query(`DROP TABLE "IBPT"`);
    }

}
