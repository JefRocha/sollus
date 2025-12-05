import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './tratamento-erro/https-exception.filter';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  let httpsOptions: { key: Buffer; cert: Buffer } | undefined;
  try {
    const keyPath = process.env.HTTPS_KEY_PATH || path.join(__dirname, '..', 'certs', 'localhost-key.pem');
    const certPath = process.env.HTTPS_CERT_PATH || path.join(__dirname, '..', 'certs', 'localhost.pem');
    const enableHttps = String(process.env.HTTPS_ENABLE || '').toLowerCase() === 'true';
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.info('HTTPS ativado com certificados em:', { keyPath, certPath });
    } else if (enableHttps) {
      console.warn('HTTPS ativado, porém certificados não encontrados. Voltando para HTTP.');
    }
  } catch (e) {
    console.warn('Falha ao configurar HTTPS:', e);
  }

  const app = await NestFactory.create(AppModule, httpsOptions ? { httpsOptions } : {});
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(helmet());
  app.use((req, res, next) => {
    console.log('Incoming request cookies:', req.cookies);
    next();
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configurar CORS para permitir credenciais (cookies)
  app.enableCors({
    origin: [
      process.env.APP_ORIGIN || 'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true, // Permite envio de cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  });
  console.log('Backend NODE_ENV:', process.env.NODE_ENV);

  await app.listen(4000, '0.0.0.0');
  console.info(`Servidor Node pronto em ${httpsOptions ? 'https' : 'http'}://localhost:4000`);
}
bootstrap();
