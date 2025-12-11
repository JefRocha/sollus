import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'pais' })
export class Pais {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'NOME', length: 100 })
  nome: string;

  @Column({ name: 'NOME_PTBR', length: 100 })
  nomePtbr: string;

  @Column({ name: 'SIGLA', length: 2 })
  sigla: string;

  @Column({ name: 'BACEN', type: 'int' })
  bacen: number;
}
