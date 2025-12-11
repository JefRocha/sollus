
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'solluserp',
    synchronize: false, // IMPORTANTE: Não sincronizar
    logging: true,
    entities: [],
    migrations: [],
});

async function run() {
    await AppDataSource.initialize();
    console.log("Database connected. Adding columns...");

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
        // Adicionar id_banco_conta_caixa
        await queryRunner.query(`
            ALTER TABLE "fin_cheque_emitido" 
            ADD COLUMN IF NOT EXISTS "id_banco_conta_caixa" integer
        `);
        console.log("Column id_banco_conta_caixa added.");

        // Adicionar FK para banco_conta_caixa (opcional, mas recomendado para consistência)
        // Verificamos se a constraint já existe antes de tentar criar
        const hasConstraint = await queryRunner.query(`
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'FK_fin_cheque_emitido_banco_conta_caixa'
        `);

        if (hasConstraint.length === 0) {
             await queryRunner.query(`
                ALTER TABLE "fin_cheque_emitido" 
                ADD CONSTRAINT "FK_fin_cheque_emitido_banco_conta_caixa" 
                FOREIGN KEY ("id_banco_conta_caixa") 
                REFERENCES "banco_conta_caixa"("id") 
                ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
            console.log("FK for id_banco_conta_caixa added.");
        } else {
            console.log("FK for id_banco_conta_caixa already exists.");
        }
        
        // Adicionar id_cheque
         await queryRunner.query(`
            ALTER TABLE "fin_cheque_emitido" 
            ADD COLUMN IF NOT EXISTS "id_cheque" integer
        `);
        console.log("Column id_cheque added.");

         const hasChequeConstraint = await queryRunner.query(`
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'FK_fin_cheque_emitido_cheque'
        `);

        if (hasChequeConstraint.length === 0) {
             await queryRunner.query(`
                ALTER TABLE "fin_cheque_emitido" 
                ADD CONSTRAINT "FK_fin_cheque_emitido_cheque" 
                FOREIGN KEY ("id_cheque") 
                REFERENCES "cheque"("id") 
                ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
            console.log("FK for id_cheque added.");
        } else {
             console.log("FK for id_cheque already exists.");
        }


    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await queryRunner.release();
        await AppDataSource.destroy();
        console.log("Done.");
    }
}

run();
