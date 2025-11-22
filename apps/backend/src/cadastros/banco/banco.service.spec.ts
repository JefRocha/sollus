import { Test, TestingModule } from '@nestjs/testing';
import { BancoService } from './banco.service';
import { Banco } from './banco.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

// Simula o BaseRepository que queremos criar
class CustomRepository extends Repository<Banco> {
  createQueryBuilder(alias?: string, queryRunner?: any): SelectQueryBuilder<Banco> {
    const builder = super.createQueryBuilder(alias, queryRunner);
    // Aqui é onde injetaríamos o filtro de tenant
    builder.andWhere('1=1');
    return builder;
  }
}

describe('BancoService Integration Check - Custom Repository', () => {
  let service: BancoService;
  let repo: CustomRepository;
  let queryBuilderMock: any;

  beforeEach(async () => {
    // Mock do QueryBuilder
    queryBuilderMock = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getOne: jest.fn().mockResolvedValue(null),
      innerJoinAndSelect: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      expressionMap: { mainAlias: { name: 'req' } } // Necessário para o TypeOrmCrudService
    };

    // Mock da classe Repository base do TypeORM
    // Precisamos mockar o comportamento do 'super.createQueryBuilder'
    const repositoryMock = {
      createQueryBuilder: jest.fn(() => queryBuilderMock),
      metadata: {
        columns: [],
        relations: [],
        connection: { options: { type: 'mysql' } },
        target: Banco
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BancoService,
        {
          provide: getRepositoryToken(Banco),
          // Aqui usamos um objeto que simula nossa classe customizada
          // Na prática, o NestJS injetaria a instância da classe
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<BancoService>(BancoService);
    repo = module.get<CustomRepository>(getRepositoryToken(Banco));
  });

  it('should call createQueryBuilder', async () => {
    try {
      await service.getMany({
        parsed: {
          fields: [],
          paramsFilter: [],
          authPersist: undefined,
          search: { $and: [] },
          filter: [],
          or: [],
          join: [],
          sort: [],
          limit: 10,
          offset: 0,
          page: 1,
          cache: undefined,
          includeDeleted: 0
        },
        options: {
          query: {}
        }
      } as any);
    } catch (e) {
      // Ignorar erros de execução do mock
    }

    expect(repo.createQueryBuilder).toHaveBeenCalled();
  });
});
