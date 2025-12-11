import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pais } from './pais.entity';

@Injectable()
export class PaisService {
  constructor(
    @InjectRepository(Pais)
    private readonly paisRepository: Repository<Pais>,
  ) {}

  findAll(): Promise<Pais[]> {
    return this.paisRepository.find();
  }

  findOne(id: number): Promise<Pais> {
    return this.paisRepository.findOneBy({ id });
  }

  async create(pais: Pais): Promise<Pais> {
    return this.paisRepository.save(pais);
  }

  async update(id: number, pais: Pais): Promise<void> {
    await this.paisRepository.update(id, pais);
  }

  async remove(id: number): Promise<void> {
    await this.paisRepository.delete(id);
  }
}
