import { DataSource } from 'typeorm';
import { dbConfig } from '../src/orm.config';
import * as dotenv from 'dotenv';

dotenv.config();

async function verifyData() {
    const dataSource = new DataSource(dbConfig as any);

    try {
        await dataSource.initialize();

        console.log('\n📊 Verificando dados populados...\n');

        const estadoCivil = await dataSource.query('SELECT COUNT(*) as total FROM "ESTADO_CIVIL"');
        console.log(`✅ ESTADO_CIVIL: ${estadoCivil[0].total} registros`);

        const nivelFormacao = await dataSource.query('SELECT COUNT(*) as total FROM "NIVEL_FORMACAO"');
        console.log(`✅ NIVEL_FORMACAO: ${nivelFormacao[0].total} registros`);

        const banco = await dataSource.query('SELECT COUNT(*) as total FROM "BANCO"');
        console.log(`✅ BANCO: ${banco[0].total} registros`);

        const cfop = await dataSource.query('SELECT COUNT(*) as total FROM "CFOP"');
        console.log(`✅ CFOP: ${cfop[0].total} registros`);

        console.log('\n✅ Todos os dados mestres foram populados com sucesso!\n');

        await dataSource.destroy();
        process.exit(0);

    } catch (error: any) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

verifyData();
