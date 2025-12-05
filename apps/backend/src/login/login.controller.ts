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
import { Controller, Post, Req, Res, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Usuario } from './../cadastros/usuario/usuario.entity';
import { LoginService } from './login.service';
import { Request, Response } from 'express';

@Controller('auth')
export class LoginController {

    constructor(private service: LoginService) { }

    @Post('login')
    async login(@Req() request: Request, @Res() response: Response) {
        try {
            let objetoJson = request.body;
            let usuario = new Usuario(objetoJson);

            const { accessToken, refreshToken } = await this.service.login(usuario);
            console.log('LoginController.login: refreshToken generated:', refreshToken);

            return response.status(HttpStatus.OK).json({ token: accessToken, refreshToken: refreshToken });
        } catch (error) {
            throw error;
        }
    }

    @Post('refresh')
    async refresh(@Req() request: Request, @Res() response: Response) {
        try {
            const oldRefreshToken = request.cookies['sollus_refresh'];
            console.log('LoginController.refresh: oldRefreshToken from cookie:', oldRefreshToken);

            if (!oldRefreshToken) {
                return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Refresh token not found' });
            }

            const { accessToken, refreshToken } = await this.service.refresh(oldRefreshToken);

            // Atualiza o cookie com o novo Refresh Token (Rotação)
            return response.status(HttpStatus.OK).json({ token: accessToken, refreshToken: refreshToken });
        } catch (error) {
            // Se falhar, limpa o cookie
            response.clearCookie('sollus_refresh', { path: '/' });
            return response.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        }
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async me(@Req() request: Request) {
        // o AuthGuard('jwt') já validou o token e anexou o payload do usuário em request.user
        const userPayload = request.user as { sub: string };
        const login = userPayload.sub;
        
        // usamos o serviço para buscar o usuário completo, carregando as relações de colaborador e pessoa
        return this.service.findOne({ 
            where: { login: login },
            relations: ['colaborador', 'colaborador.pessoa']
        });
    }
}
