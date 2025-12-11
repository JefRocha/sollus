import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { PaisService } from './pais.service';
import { Pais } from './pais.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cadastros')
@Controller('pais')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  findAll(): Promise<Pais[]> {
    return this.paisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Pais> {
    return this.paisService.findOne(+id);
  }

  @Post()
  create(@Body() pais: Pais): Promise<Pais> {
    return this.paisService.create(pais);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() pais: Pais): Promise<void> {
    return this.paisService.update(+id, pais);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.paisService.remove(+id);
  }
}
