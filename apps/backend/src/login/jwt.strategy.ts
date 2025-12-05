import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt.constants';

// Função para extrair o token do cookie ou do cabeçalho de autorização
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['sollus_access_token'];
  }
  // Se não encontrar no cookie, tenta extrair do cabeçalho Authorization Bearer
  if (!token) {
    token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor, // Usa a função extratora personalizada
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // O Passport já validou a assinatura do token e a expiração.
    // O objeto retornado aqui será anexado ao request.user.
    return { sub: payload.sub, tenant: payload.tenant };
  }
}
