# Backend: CSRF, Cookies HttpOnly e CORS

## Objetivo
- Proteger mutações com CSRF.
- Migrar tokens para cookies `HttpOnly + Secure + SameSite=Strict`.
- Endurecer CORS para a origem do frontend.

## Variáveis de Ambiente
- `APP_ORIGIN=http://localhost:3000`
- `COOKIE_SECURE=false` (em produção: `true`)

## main.ts (NestJS)
```
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-CSRF-Token']
  })

  app.use(cookieParser())
  app.use(helmet())

  await app.listen(4000)
}
bootstrap()
```

## CSRF Controller (`/csrf`)
```
import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import * as crypto from 'crypto'

@Controller('csrf')
export class CsrfController {
  @Get()
  getToken(@Req() req: Request, @Res() res: Response) {
    const existing = req.cookies['XSRF-TOKEN']
    const token = existing || crypto.randomBytes(32).toString('hex')
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'strict',
      path: '/'
    })
    return { csrfToken: token }
  }
}
```

## CSRF Guard (double submit cookie)
```
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    const method = String(req.method || 'GET').toUpperCase()
    const needsCsrf = /^(POST|PUT|PATCH|DELETE)$/.test(method)
    if (!needsCsrf) return true

    const headerToken = req.headers['x-csrf-token']
    const cookieToken = req.cookies?.['XSRF-TOKEN']
    if (!headerToken || !cookieToken || String(headerToken) !== String(cookieToken)) {
      throw new ForbiddenException('CSRF token invalid')
    }
    return true
  }
}
```

### Aplicação do Guard
```
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CsrfGuard } from './csrf.guard'

@Module({
  providers: [{ provide: APP_GUARD, useClass: CsrfGuard }]
})
export class SecurityModule {}
```

Registrar `SecurityModule` em `AppModule`.

## Login/Refresh com Cookies HttpOnly
```
import { Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // ... valida credenciais e gera tokens
    const accessToken = '...'
    const refreshToken = '...'
    const secure = process.env.COOKIE_SECURE === 'true'

    res.cookie('access_token', accessToken, {
      httpOnly: true, secure, sameSite: 'strict', path: '/', maxAge: 3600_000
    })
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, secure, sameSite: 'strict', path: '/', maxAge: 7 * 24 * 3600_000
    })
    return { success: true }
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const rt = req.cookies['refresh_token']
    // ... valida e emite novo access
    const accessToken = '...'
    const secure = process.env.COOKIE_SECURE === 'true'
    res.cookie('access_token', accessToken, {
      httpOnly: true, secure, sameSite: 'strict', path: '/', maxAge: 3600_000
    })
    return { success: true }
  }
}
```

## Testes
1. `GET /csrf`: verifica cookie `XSRF-TOKEN` e resposta com `{ csrfToken }`.
2. `POST` sem header: recebe `403 CSRF token invalid`.
3. `POST` com `X-CSRF-Token` igual ao cookie: sucesso.
4. Login: confere cookies `access_token` e `refresh_token` httpOnly.
5. Refresh: confere reemissão de `access_token` via cookie.

