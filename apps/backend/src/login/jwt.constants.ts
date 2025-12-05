// Em uma aplicação real, use uma chave secreta forte e armazene-a em variáveis de ambiente.
import * as dotenv from 'dotenv';
dotenv.config();

export const jwtConstants = {
  secret: String(process.env.JWT_SECRET || '#Sua-chave-de-32-caracteres-aqui-deve-ser-alterada'),
};
