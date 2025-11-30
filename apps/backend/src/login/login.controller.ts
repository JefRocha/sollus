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
import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { Usuario } from './../cadastros/usuario/usuario.entity';
import { LoginService } from './login.service';
import { Request, Response } from 'express';

@Controller()
export class LoginController {

    constructor(private service: LoginService) { }

    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            let objetoJson = request.body;
            let usuario = new Usuario(objetoJson);

            const { accessToken, refreshToken } = await this.service.login(usuario);

            // Define o cookie HttpOnly com o Refresh Token
            response.cookie('sollus_refresh', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Só HTTPS em produção
                sameSite: 'strict', // Proteção contra CSRF
                path: '/', // Cookie enviado em todas as rotas
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
            });

            return response.status(HttpStatus.OK).json({ token: accessToken });
        } catch (error) {
            throw error;
        }
    }

    @Post('auth/refresh')
    async refresh(@Req() request: Request, @Res() response: Response) {
        try {
            const oldRefreshToken = request.cookies['sollus_refresh'];

            if (!oldRefreshToken) {
                return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token not found' });
            }

            const { accessToken, refreshToken } = await this.service.refresh(oldRefreshToken);

            // Atualiza o cookie com o novo Refresh Token (Rotação)
            response.cookie('sollus_refresh', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return response.status(HttpStatus.OK).json({ token: accessToken });
        } catch (error) {
            // Se falhar, limpa o cookie
            response.clearCookie('sollus_refresh', { path: '/' });
            return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        }
    }
}