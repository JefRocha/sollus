import { Repository, SelectQueryBuilder, QueryRunner, SaveOptions } from 'typeorm';
import { ClsService } from 'nestjs-cls';

export class BaseRepository<T> extends Repository<T> {
    constructor(
        private readonly repo: Repository<T>,
        private readonly cls?: ClsService
    ) {
        super(repo.target, repo.manager, repo.queryRunner);
    }

    createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
        const builder = this.repo.createQueryBuilder(alias, queryRunner);

        try {
            // Pega o tenant ID do contexto CLS
            const tenantId = this.cls?.get<number>('TENANT_ID');

            // Verifica se a entidade tem a coluna ID_EMPRESA (ou relação empresa)
            const hasEmpresaColumn = this.metadata.columns.some(c => c.propertyName === 'empresa' || c.databaseName === 'ID_EMPRESA' || c.databaseName === 'id_empresa');
            const hasEmpresaRelation = this.metadata.relations.some(r => r.propertyName === 'empresa');

            if (tenantId && (hasEmpresaColumn || hasEmpresaRelation)) {
                // Usa o alias fornecido ou o alias padrão do builder
                const entityAlias = alias || builder.alias;

                // Validação de segurança do alias
                if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(entityAlias)) {
                    throw new Error(`Invalid query builder alias: ${entityAlias}`);
                }

                builder.andWhere(`${entityAlias}.empresa = :tenantId`, { tenantId });
            }
        } catch (error) {
            // CLS não disponível - pode ser uma rota sem autenticação ou inicialização
            // Silently ignore
        }

        return builder;
    }

    async save<T>(entity: T, options?: SaveOptions): Promise<T>;
    async save<T>(entities: T[], options?: SaveOptions): Promise<T[]>;
    async save<T>(entityOrEntities: T | T[], options?: SaveOptions): Promise<T | T[]> {
        try {
            // Pega o tenant ID do contexto CLS
            const tenantId = this.cls?.get<number>('TENANT_ID');

            if (tenantId) {
                if (Array.isArray(entityOrEntities)) {
                    entityOrEntities.forEach(e => this.setTenant(e, tenantId, this.metadata));
                } else {
                    this.setTenant(entityOrEntities, tenantId, this.metadata);
                }
            }
        } catch (error) {
            // CLS não disponível - pode ser uma rota sem autenticação
            // Silently ignore
        }

        return this.repo.save(entityOrEntities as any, options);
    }

    private setTenant(entity: any, tenantId: number, metadata: any) {
        // Verifica se a entidade tem a coluna ID_EMPRESA (ou relação empresa)
        const hasEmpresaColumn = metadata.columns.some((c: any) => c.propertyName === 'empresa' || c.databaseName === 'ID_EMPRESA' || c.databaseName === 'id_empresa');
        const hasEmpresaRelation = metadata.relations.some((r: any) => r.propertyName === 'empresa');

        if (hasEmpresaColumn || hasEmpresaRelation) {
            // Só define o tenant se a entidade for projetada para ser tenant-aware
            if (!entity.empresa && !entity.idEmpresa) {
                entity.empresa = { id: tenantId };
            }
        }
    }
}
