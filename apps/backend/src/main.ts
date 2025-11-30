import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './tratamento-erro/https-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  await app.listen(4000, '0.0.0.0');
  console.info('Servidor Node pronto em http://localhost:4000');
}
bootstrap();