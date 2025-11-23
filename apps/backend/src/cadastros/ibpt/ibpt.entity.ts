import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('IBPT')
export class Ibpt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'NCM', type: 'varchar', length: 8, nullable: true })
    ncm: string;

    @Column({ name: 'EX', type: 'char', length: 2, nullable: true })
    ex: string;

    @Column({ name: 'TIPO', type: 'char', length: 1, nullable: true })
    tipo: string;

    @Column({ name: 'DESCRICAO', type: 'text', nullable: true })
    descricao: string;

    @Column({ name: 'NACIONAL_FEDERAL', type: 'decimal', precision: 18, scale: 6, nullable: true })
    nacionalFederal: number;

    @Column({ name: 'IMPORTADOS_FEDERAL', type: 'decimal', precision: 18, scale: 6, nullable: true })
    importadosFederal: number;

    @Column({ name: 'ESTADUAL', type: 'decimal', precision: 18, scale: 6, nullable: true })
    estadual: number;

    @Column({ name: 'MUNICIPAL', type: 'decimal', precision: 18, scale: 6, nullable: true })
    municipal: number;

    @Column({ name: 'VIGENCIA_INICIO', type: 'date', nullable: true })
    vigenciaInicio: Date;

    @Column({ name: 'VIGENCIA_FIM', type: 'date', nullable: true })
    vigenciaFim: Date;

    @Column({ name: 'CHAVE', type: 'varchar', length: 6, nullable: true })
    chave: string;

    @Column({ name: 'VERSAO', type: 'varchar', length: 6, nullable: true })
    versao: string;

    @Column({ name: 'FONTE', type: 'varchar', length: 34, nullable: true })
    fonte: string;
}
