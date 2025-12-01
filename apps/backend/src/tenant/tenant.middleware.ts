import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(private readonly cls: ClsService) { }

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            if (token) {
                try {
                    const jwt = require('jsonwebtoken');
                    const decoded = jwt.decode(token);

                    if (decoded?.tenant) {
                        this.cls.set('TENANT_ID', decoded.tenant);
                    }
                } catch (error) {
                    // Token inválido, não define o tenant
                }
            }
        }

        next();
    }
}
