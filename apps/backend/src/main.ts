import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './tratamento-erro/https-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use((req, res, next) => {
    console.log('Incoming request cookies:', req.cookies);
    next();
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar CORS para permitir credenciais (cookies)
  app.enableCors({
    origin: 'http://localhost:3000', // Origem específica do frontend
    credentials: true, // Permite envio de cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  console.log('Backend NODE_ENV:', process.env.NODE_ENV);

  await app.listen(4000, '0.0.0.0');
  console.info('Servidor Node pronto em http://localhost:4000');
}
bootstrap();