import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Cbo } from './cbo.entity';
import { BaseRepository } from '../../common/base.repository';
import { ClsService } from 'nestjs-cls';
import { CrudRequest } from '@nestjsx/crud';
import { DeepPartial } from 'typeorm';

@Injectable()
export class CboService extends TypeOrmCrudService<Cbo> {

    constructor(
        @InjectRepository(Cbo) repository,
        private readonly cls: ClsService
    ) {
        super(new BaseRepository(repository, cls));
    }

    // Manually implement replaceOne to bypass the bug in @nestjsx/crud
    async replaceOne(req: CrudRequest, dto: DeepPartial<Cbo>): Promise<Cbo> {
        // Extract ID from req.parsed.paramsFilter
        const id = Number(req.parsed.paramsFilter[0]?.value);

        if (!id) {
            throw new BadRequestException('Invalid ID parameter');
        }

        const entity = await this.repo.findOne({ where: { id } });

        if (!entity) {
            throw new NotFoundException('Cbo not found');
        }

        // Apply changes from dto
        Object.assign(entity, dto);

        return this.repo.save(entity as any);
    }
}
