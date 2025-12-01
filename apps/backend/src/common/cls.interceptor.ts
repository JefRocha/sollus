import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClsInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return new Observable((subscriber) => {
            this.cls.run(() => {
                const request = context.switchToHttp().getRequest();

                // Prioriza o tenantId do header (enviado pelo frontend server-side)
                const tenantIdFromHeader = request.headers['x-tenant-id'];
                if (tenantIdFromHeader) {
                    this.cls.set('TENANT_ID', +tenantIdFromHeader);
                }

                const authHeader = request.headers.authorization;
                if (authHeader) {
                    const token = authHeader.split(' ')[1];
                    if (token) {
                        try {
                            const decoded = jwt.decode(token) as jwt.JwtPayload;
                            if (decoded) {
                                // Define o usuário e o tenant a partir do token
                                this.cls.set('user', decoded);
                                // Se o tenant não veio do header, usa o do token
                                if (!tenantIdFromHeader && decoded.tenant) {
                                    this.cls.set('TENANT_ID', decoded.tenant);
                                }
                            }
                        } catch (error) {
                            // Token inválido, não faz nada
                        }
                    }
                }

                next.handle().subscribe({
                    next: (value) => subscriber.next(value),
                    error: (err) => subscriber.error(err),
                    complete: () => subscriber.complete(),
                });
            });
        });
    }
}
