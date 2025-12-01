import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cbo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    codigo: string;

    // @Column({ name: 'CODIGO_1994' })
    // codigo1994: string;

    @Column()
    nome: string;

    @Column({ nullable: true }) // Made nullable
    observacao: string;

    constructor(objetoJson: {}) {
        if (objetoJson != null) {
            this.id = objetoJson['id'] == 0 ? undefined : objetoJson['id'];
            this.codigo = objetoJson['codigo'];
            // this.codigo1994 = objetoJson['codigo1994'];
            this.nome = objetoJson['nome'];
            this.observacao = objetoJson['observacao'];
        }
    }
}
