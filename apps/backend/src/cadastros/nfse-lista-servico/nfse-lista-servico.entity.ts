import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NFSE_LISTA_SERVICO')
export class NfseListaServico {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'CODIGO', type: 'char', length: 5, nullable: true })
    codigo: string;

    @Column({ name: 'DESCRICAO', type: 'text', nullable: true })
    descricao: string;
}
