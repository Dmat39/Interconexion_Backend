import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'ADMIN',
  TECNICO = 'TECNICO',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.TECNICO })
  rol: RolUsuario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  created_at: Date;
}
