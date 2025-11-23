import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNfseListaServicoTableClean1763939000000 implements MigrationInterface {
    name = 'CreateNfseListaServicoTableClean1763939000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela NFSE_LISTA_SERVICO
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "NFSE_LISTA_SERVICO" (
            "id" SERIAL NOT NULL,
            "CODIGO" character(5),
            "DESCRICAO" text,
            CONSTRAINT "PK_NFSE_LISTA_SERVICO" PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover tabela NFSE_LISTA_SERVICO
        await queryRunner.query(`DROP TABLE IF EXISTS "NFSE_LISTA_SERVICO"`);
    }

}
