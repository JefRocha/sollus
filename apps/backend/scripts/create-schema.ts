import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    console.log('🔄 Inicializando aplicação para criar schema...\n');

    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
    });

    console.log('✅ Schema criado com sucesso!');
    console.log('📋 Aguardando 3 segundos para garantir que tudo foi criado...\n');

    await new Promise(resolve => setTimeout(resolve, 3000));

    await app.close();
    console.log('✅ Aplicação encerrada. Verifique o schema com check-schema.ts');
    process.exit(0);
}

bootstrap();
