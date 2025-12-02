import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ibpt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 8, nullable: true })
    ncm: string;

    @Column({ type: 'char', length: 2, nullable: true })
    ex: string;

    @Column({ type: 'char', length: 1, nullable: true })
    tipo: string;

    @Column({ type: 'text', nullable: true })
    descricao: string;

    @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
    nacionalFederal: number;

    @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
    importadosFederal: number;

    @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
    estadual: number;

    @Column({ type: 'decimal', precision: 18, scale: 6, nullable: true })
    municipal: number;

    @Column({ type: 'date', nullable: true })
    vigenciaInicio: Date;

    @Column({ type: 'date', nullable: true })
    vigenciaFim: Date;

    @Column({ type: 'varchar', length: 6, nullable: true })
    chave: string;

    @Column({ type: 'varchar', length: 6, nullable: true })
    versao: string;

    @Column({ type: 'varchar', length: 34, nullable: true })
    fonte: string;
}