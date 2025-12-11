import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisController } from './pais.controller';
import { PaisService } from './pais.service';
import { Pais } from './pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pais])],
  controllers: [PaisController],
  providers: [PaisService],
})
export class PaisModule {}
