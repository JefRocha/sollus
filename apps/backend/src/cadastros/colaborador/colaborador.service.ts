import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Colaborador } from '../pessoa/colaborador.entity';
import { BaseRepository } from '../../common/base.repository';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class ColaboradorService extends TypeOrmCrudService<Colaborador> {

    constructor(
        @InjectRepository(Colaborador) repository,
        private readonly cls: ClsService
    ) {
        super(new BaseRepository(repository, cls));
    }
}
