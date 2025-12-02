import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorController } from './colaborador.controller';
import { ColaboradorService } from './colaborador.service';
import { Colaborador } from '../pessoa/colaborador.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Colaborador])],
    controllers: [ColaboradorController],
    providers: [ColaboradorService],
    exports: [ColaboradorService],
})
export class ColaboradorModule { }
