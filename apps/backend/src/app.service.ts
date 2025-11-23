import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá, estamos iniciando o CS Solutions ERP sollus usando o NestJS!';
  }
}
