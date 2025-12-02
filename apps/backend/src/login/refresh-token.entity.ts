import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../cadastros/usuario/usuario.entity';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    token: string;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'boolean', default: false })
    isRevoked: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastActivityAt: Date;

    @ManyToOne(() => Usuario)
    @JoinColumn()
    usuario: Usuario;
}
