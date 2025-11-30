import { Repository, SelectQueryBuilder, QueryRunner, DeepPartial, SaveOptions } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';

export class BaseRepository<T> extends Repository<T> {
    constructor(
        private readonly repo: Repository<T>,
        private readonly tenantService: TenantService
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        const builder = this.repo.createQueryBuilder(alias, queryRunner);
        const tenantId = this.tenantService.tenantId;

        // Verifica se a entidade tem a coluna ID_EMPRESA (ou relação empresa)
        // Podemos checar os metadados, mas por enquanto vamos assumir que se estamos usando esse repo, é para filtrar
        // Uma verificação mais robusta seria:
        const hasEmpresaColumn = this.metadata.columns.some(c => c.propertyName === 'empresa' || c.databaseName === 'ID_EMPRESA');
        const hasEmpresaRelation = this.metadata.relations.some(r => r.propertyName === 'empresa');

        if (tenantId && (hasEmpresaColumn || hasEmpresaRelation)) {
            // Usa o alias fornecido ou o nome da tabela/target
            const entityAlias = alias || this.metadata.targetName;

            // Validação de segurança do alias
            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(entityAlias)) {
                throw new Error(`Invalid query builder alias: ${entityAlias}`);
            }

            builder.andWhere(`${entityAlias}.empresa = :tenantId`, { tenantId });
        }

        return builder;
    }

    async save<T>(entity: T, options?: SaveOptions): Promise<T>;
    async save<T>(entities: T[], options?: SaveOptions): Promise<T[]>;
    async save<T>(entityOrEntities: T | T[], options?: SaveOptions): Promise<T | T[]> {
        const tenantId = this.tenantService.tenantId;

        if (tenantId) {
            if (Array.isArray(entityOrEntities)) {
                entityOrEntities.forEach(e => this.setTenant(e, tenantId));
            } else {
                this.setTenant(entityOrEntities, tenantId);
            }
        }

        return this.repo.save(entityOrEntities as any, options);
    }

    private setTenant(entity: any, tenantId: number) {
        // Verifica se a entidade já tem empresa definida, se não, define
        if (!entity.empresa && !entity.idEmpresa) {
            entity.empresa = { id: tenantId };
        }
    }
}
