import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Vecino } from './vecino.entity';
import { GrupoVisita } from './grupo-visita.entity';

export enum EstadoVisita {
  PROGRAMADA = 'PROGRAMADA',
  COMPLETADA = 'COMPLETADA',
  NO_ATENDIDO = 'NO_ATENDIDO',
  REPROGRAMAR = 'REPROGRAMAR',
}

@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vecino, (v) => v.visitas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vecino_id' })
  vecino: Vecino;

  @Column()
  vecino_id: string;

  @ManyToOne(() => GrupoVisita, (g) => g.visitas, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'grupo_id' })
  grupo: GrupoVisita;

  @Column({ nullable: true })
  grupo_id: string;

  @Column({ nullable: true })
  orden: number;

  @Column({ type: 'date' })
  fecha_programada: string;

  @Column({ type: 'time', nullable: true })
  hora_programada: string;

  @Column()
  tecnico: string;

  @Column({ type: 'enum', enum: EstadoVisita, default: EstadoVisita.PROGRAMADA })
  estado: EstadoVisita;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ nullable: true })
  resultado: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
