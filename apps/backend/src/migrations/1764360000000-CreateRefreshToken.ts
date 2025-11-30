import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRefreshToken1764360000000 implements MigrationInterface {
    name = 'CreateRefreshToken1764360000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "REFRESH_TOKEN" ("id" SERIAL NOT NULL, "TOKEN" character varying(255) NOT NULL, "ID_USUARIO" integer NOT NULL, "EXPIRES_AT" TIMESTAMP NOT NULL, "IS_REVOKED" boolean NOT NULL DEFAULT false, "CREATED_AT" TIMESTAMP NOT NULL DEFAULT now(), "LAST_ACTIVITY_AT" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_REFRESH_TOKEN_TOKEN" UNIQUE ("TOKEN"), CONSTRAINT "PK_REFRESH_TOKEN" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "REFRESH_TOKEN" ADD CONSTRAINT "FK_REFRESH_TOKEN_USUARIO" FOREIGN KEY ("ID_USUARIO") REFERENCES "USUARIO"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "REFRESH_TOKEN" DROP CONSTRAINT "FK_REFRESH_TOKEN_USUARIO"`);
        await queryRunner.query(`DROP TABLE "REFRESH_TOKEN"`);
    }
}
