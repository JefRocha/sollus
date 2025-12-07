import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataAceitePoliticaToUsuario1765126217081 implements MigrationInterface {
    name = 'AddDataAceitePoliticaToUsuario1765126217081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" ADD "data_aceite_politica" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "data_aceite_politica"`);
    }
}
