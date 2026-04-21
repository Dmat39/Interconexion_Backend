import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Vecino } from './vecino.entity';

export enum EstadoVecinal {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  RECUPERAR = 'RECUPERAR',
}

@Entity('vecinales_activas')
export class VecinalActiva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  tecnico: string;

  @Column({ nullable: true })
  num_camaras: number;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ type: 'enum', enum: EstadoVecinal, default: EstadoVecinal.ACTIVA })
  estado: EstadoVecinal;

  @Column({ nullable: true })
  vecino_id: string;

  @ManyToOne(() => Vecino, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'vecino_id' })
  vecino: Vecino;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}