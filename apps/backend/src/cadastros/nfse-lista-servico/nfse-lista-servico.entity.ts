import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NfseListaServico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'char', length: 5, nullable: true })
    codigo: string;

    @Column({ type: 'text', nullable: true })
    descricao: string;
}