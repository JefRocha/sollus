/*******************************************************************************
Title: CS Solutions ERP sollus                                                                
Description: Service responsável por validar os dados do usuário, gerar o token 
e validar o token.
                                                                                
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
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Usuario } from './../cadastros/usuario/usuario.entity';
import { RefreshToken } from './refresh-token.entity';
import { Repository } from 'typeorm';

import { BaseRepository } from '../common/base.repository';
import { ClsService } from 'nestjs-cls';
@Injectable()
export class LoginService extends TypeOrmCrudService<Usuario> {

    private key: string = "#Sua-chave-de-32-caracteres-aqui";

    constructor(
        @InjectRepository(Usuario) repository,
        @InjectRepository(RefreshToken) private refreshTokenRepo: Repository<RefreshToken>
    ) {
        super(new BaseRepository(repository));
    }

    async login(usuario: Usuario) {
        const crypto = require('crypto');
        let md5Senha = crypto.createHash('md5').update(usuario.login + usuario.senha).digest('hex');

        // Busca o usuário com as relações necessárias para identificar a empresa
        let user = await this.findOne({
            where: { login: usuario.login, senha: md5Senha },
            relations: ['colaborador', 'colaborador.empresa']
        });

        if (user != null) {
            const tenantId = user.colaborador?.empresa?.id || null;

            // Gera Access Token (15 min)
            const accessToken = this.gerarJwt(usuario.login, tenantId, '15m');

            // Gera Refresh Token (7 dias)
            const refreshToken = await this.createRefreshToken(user.id);

            return { accessToken, refreshToken };
        }
        throw new UnauthorizedException();
    }

    async createRefreshToken(userId: number): Promise<string> {
        const crypto = require('crypto');
        const token = crypto.randomBytes(64).toString('hex');

        const refreshToken = this.refreshTokenRepo.create({
            userId,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
            isRevoked: false,
            lastActivityAt: new Date() // Define atividade inicial
        });

        await this.refreshTokenRepo.save(refreshToken);
        return token;
    }

    async refresh(oldRefreshToken: string) {
        const tokenDoc = await this.refreshTokenRepo.findOne({
            where: { token: oldRefreshToken }
        });

        if (!tokenDoc || tokenDoc.isRevoked || tokenDoc.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Verifica inatividade (2 horas sem requisições)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        if (tokenDoc.lastActivityAt < twoHoursAgo) {
            // Revoga token por inatividade
            tokenDoc.isRevoked = true;
            await this.refreshTokenRepo.save(tokenDoc);
            throw new UnauthorizedException('Session expired due to inactivity');
        }

        // Revoga o token antigo (Rotação de Token)
        tokenDoc.isRevoked = true;
        await this.refreshTokenRepo.save(tokenDoc);

        // Busca o usuário separadamente
        const user = await this.findOne({
            where: { id: tokenDoc.userId },
            relations: ['colaborador', 'colaborador.empresa']
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Gera novos tokens
        const tenantId = user.colaborador?.empresa?.id || null;

        const newAccessToken = this.gerarJwt(user.login, tenantId, '15m');
        const newRefreshToken = await this.createRefreshToken(user.id);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    gerarJwt(login: string, tenantId: number | null, expiresIn: string = '7d') {
        const jwt = require('jsonwebtoken');

        const payload = {
            sub: login,
            tenant: tenantId
        };

        return jwt.sign(payload, this.key, { expiresIn });
    }

    verificarToken(token: string): boolean {
        try {
            const jwt = require('jsonwebtoken');
            let decoded = jwt.verify(token, this.key);

            if (decoded != null) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }
}