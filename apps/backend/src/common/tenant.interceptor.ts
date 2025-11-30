import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    constructor(private readonly tenantService: TenantService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const tenantId = this.tenantService.tenantId;

        // Se há um tenantId, adiciona filtro automático nas queries do @nestjsx/crud
        if (tenantId && request.method === 'GET') {
            // Adiciona filtro de empresa nas queries GET
            if (!request.query) {
                request.query = {};
            }

            // Se já existe um filtro, adiciona o tenant a ele
            if (request.query.filter) {
                // Parse existing filter if it's a string
                let existingFilter = request.query.filter;
                if (typeof existingFilter === 'string') {
                    try {
                        existingFilter = JSON.parse(existingFilter);
                    } catch (e) {
                        existingFilter = {};
                    }
                }

                // Add tenant filter
                if (Array.isArray(existingFilter)) {
                    existingFilter.push({ 'empresa.id': tenantId });
                } else {
                    existingFilter['empresa.id'] = tenantId;
                }

                request.query.filter = existingFilter;
            } else {
                // Create new filter with tenant
                request.query.filter = { 'empresa.id': tenantId };
            }

            // Also add to 's' (search) parameter if using @nestjsx/crud search
            if (!request.query.s) {
                request.query.s = JSON.stringify({ 'empresa.id': tenantId });
            }
        }

        return next.handle();
    }
}
