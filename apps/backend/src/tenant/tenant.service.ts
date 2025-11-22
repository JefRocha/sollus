import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
    constructor(@Inject(REQUEST) private readonly request: Request) { }

    get tenantId(): number | null {
        const authHeader = this.request.headers.authorization;
        if (!authHeader) {
            return null;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return null;
        }

        try {
            const jwt = require('jsonwebtoken');
            // Decodifica sem verificar assinatura aqui, pois o Guard já deve ter verificado
            // Ou se preferir, pode verificar novamente. Para performance, apenas decode é mais rápido se confiamos no Guard.
            const decoded = jwt.decode(token);
            return decoded?.tenant || null;
        } catch (error) {
            return null;
        }
    }
}
