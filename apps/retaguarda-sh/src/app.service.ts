import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá, estamos iniciando a Retaguarda da Software House da CS Solutions usando o NestJS!';
  }
}
