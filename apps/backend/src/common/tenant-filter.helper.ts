import { Brackets, SelectQueryBuilder } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';

/**
 * Aplica o filtro de tenant ao query builder.
 * Deve ser chamado no método createBuilder de cada serviço CRUD.
 */
export function applyTenantFilter<T>(
    builder: SelectQueryBuilder<T>,
    tenantService: TenantService
): SelectQueryBuilder<T> {
    const tenantId = tenantService?.tenantId;

    if (!tenantId) {
        return builder;
    }

    const alias = builder.alias;
    // Valida alias para prevenir injection (apenas letras, números e underscore)
    if (!alias || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(alias)) {
        throw new Error(`Invalid query builder alias: ${alias}`);
    }

    // Aplica o filtro diretamente (sem Brackets desnecessário)
    builder.andWhere(`${alias}.empresa = :tenantId`, { tenantId });

    return builder;
}
