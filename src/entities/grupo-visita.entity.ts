import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Visita } from './visita.entity';

export enum EstadoGrupo {
  PENDIENTE = 'PENDIENTE',
  EN_CURSO = 'EN_CURSO',
  COMPLETADO = 'COMPLETADO',
}

@Entity('grupos_visita')
export class GrupoVisita {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  tecnico: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ type: 'enum', enum: EstadoGrupo, default: EstadoGrupo.PENDIENTE })
  estado: EstadoGrupo;

  @Column({ nullable: true })
  observaciones: string;

  @OneToMany(() => Visita, (v) => v.grupo)
  visitas: Visita[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
