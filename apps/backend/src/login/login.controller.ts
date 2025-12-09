/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Controller para definir a rota que será utilizada para realizar 
o login.
                                                                                
The MIT License                                                                 
                                                                                
Copyright: Copyright (C) 2020 CS Solutions.COM                                          
                                                                                
Permission is hereby granted, free of charge, to any person                     
obtaining a copy of this software and associated documentation                  
files (the "Software"), to deal in the Software without                         
restriction, including without limitation the rights to use,                    
copy, modify, merge, publish, distribute, sublicense, and/or sell               
copies of the Software, and to permit persons to whom the                       
Software is furnished to do so, subject to the following                        
conditions:                                                                     
                                                                                
The above copyright notice and this permission notice shall be                  
included in all copies or substantial portions of the Software.                 
                                                                                
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,                 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES                 
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND                        
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT                     
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,                    
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING                    
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR                   
OTHER DEALINGS IN THE SOFTWARE.                                                 
                                                                                
       The author may be contacted at:                                          
           CS Solutions.com@gmail.com                                                   
                                                                                
@author Albert Eije (alberteije@gmail.com)                    
@version 1.0.0
*******************************************************************************/
import {
  Controller,
  Post,
  Req,
  Res,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from './../cadastros/usuario/usuario.entity';
import { LoginService } from './login.service';
import { Request, Response } from 'express';

@Controller('auth')
export class LoginController {
  constructor(private service: LoginService) { }

  private rl = new Map<string, { c: number; t: number }>();
  private allow(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const cur = this.rl.get(key);
    if (!cur || now - cur.t > windowMs) {
      this.rl.set(key, { c: 1, t: now });
      return true;
    }
    if (cur.c >= limit) return false;
    cur.c += 1;
    return true;
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    try {
      const ip = String(request.ip || request.socket.remoteAddress || '');
      if (!this.allow(`login:${ip}`, 10, 60_000)) {
        return response.status(HttpStatus.TOO_MANY_REQUESTS).json({ message: 'Too many attempts' });
      }
      let objetoJson = request.body;
      let usuario = new Usuario(objetoJson);

      const { accessToken, refreshToken } = await this.service.login(usuario);
      response.cookie('sollus_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'none',
        path: '/',
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        maxAge: 3600_000,
      });
      response.cookie('sollus_refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'none',
        path: '/',
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        maxAge: 7 * 24 * 3600_000,
      });
      return response
        .status(HttpStatus.OK)
        .json({ token: accessToken, refreshToken: refreshToken });
    } catch (error) {
      throw error;
    }
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res() response: Response) {
    try {
      const ip = String(request.ip || request.socket.remoteAddress || '');
      if (!this.allow(`refresh:${ip}`, 30, 60_000)) {
        return response.status(HttpStatus.TOO_MANY_REQUESTS).json({ message: 'Too many attempts' });
      }
      const oldRefreshToken = request.cookies['sollus_refresh_token'];

      if (!oldRefreshToken) {
        return response
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Refresh token not found' });
      }

      const { accessToken, refreshToken } = await this.service.refresh(
        oldRefreshToken,
      );

      response.cookie('sollus_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: 'none',
        path: '/',
        ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
        maxAge: 3600_000,
      });
      return response
        .status(HttpStatus.OK)
        .json({ token: accessToken, refreshToken: refreshToken });
    } catch (error) {
      // Se falhar, limpa o cookie
      response.clearCookie('sollus_refresh_token', { path: '/', ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}) });
      return response
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid refresh token' });
    }
  }

  @Post('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    try {
      const rt = request.cookies['sollus_refresh_token'];
      if (rt) {
        await this.service.revokeByRefreshTokenPlain(rt);
      }
    } catch { }
    response.clearCookie('sollus_access_token', { path: '/', ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}) });
    response.clearCookie('sollus_refresh_token', { path: '/', ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}) });
    return response.status(HttpStatus.OK).json({ ok: true });
  }

  @Post('aceite-politica')
  @UseGuards(AuthGuard('jwt'))
  async aceitarPolitica(@Req() request: Request) {
    const userPayload = request.user as { sub: string };
    const login = userPayload.sub;
    await this.service.aceitarPolitica(login);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async me(@Req() request: Request) {
    // o AuthGuard('jwt') já validou o token e anexou o payload do usuário em request.user
    const userPayload = request.user as { sub: string };
    const login = userPayload.sub;

    // usamos o serviço para buscar o usuário completo, carregando as relações de colaborador e pessoa
    const user = await this.service.findOne({
      where: { login: login },
      relations: ['colaborador', 'colaborador.pessoa', 'papel'],
    });
    return user;
  }
}
