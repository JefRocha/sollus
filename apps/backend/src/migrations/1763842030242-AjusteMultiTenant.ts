import { MigrationInterface, QueryRunner } from "typeorm";

export class AjusteMultiTenant1763842030242 implements MigrationInterface {
    name = 'AjusteMultiTenant1763842030242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP CONSTRAINT "FK_ba39a81c12606deedf32688fde5"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP CONSTRAINT "FK_6b77cb86182930d0f0831630a98"`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" DROP COLUMN "DATA_PAGAMENTO"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" ADD "DATA_PAGAMENTO" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD CONSTRAINT "FK_6b77cb86182930d0f0831630a98" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD CONSTRAINT "FK_ba39a81c12606deedf32688fde5" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP CONSTRAINT "FK_ba39a81c12606deedf32688fde5"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP CONSTRAINT "FK_6b77cb86182930d0f0831630a98"`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" DROP COLUMN "DATA_PAGAMENTO"`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" DROP COLUMN "ID_EMPRESA"`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "FIN_PARCELA_PAGAR" ADD "DATA_PAGAMENTO" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD "ID_EMPRESA" integer`);
        await queryRunner.query(`ALTER TABLE "CLIENTE" ADD CONSTRAINT "FK_6b77cb86182930d0f0831630a98" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "COLABORADOR" ADD CONSTRAINT "FK_a50f67ab134606e21ba72fa84a6" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "VENDA_FRETE" ADD CONSTRAINT "FK_d4075419976ed80b5fd7a80bbd7" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TABELA_PRECO" ADD CONSTRAINT "FK_ba39a81c12606deedf32688fde5" FOREIGN KEY ("ID_EMPRESA") REFERENCES "EMPRESA"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
