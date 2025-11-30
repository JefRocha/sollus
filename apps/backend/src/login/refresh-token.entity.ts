import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../cadastros/usuario/usuario.entity';

@Entity('REFRESH_TOKEN')
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'TOKEN', type: 'varchar', length: 255, unique: true })
    token: string;

    @Column({ name: 'ID_USUARIO', type: 'int' })
    userId: number;

    @Column({ name: 'EXPIRES_AT', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'IS_REVOKED', type: 'boolean', default: false })
    isRevoked: boolean;

    @CreateDateColumn({ name: 'CREATED_AT' })
    createdAt: Date;

    @Column({ name: 'LAST_ACTIVITY_AT', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastActivityAt: Date;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'ID_USUARIO' })
    usuario: Usuario;
}
