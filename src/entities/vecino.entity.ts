import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { CamaraVecino } from './camara-vecino.entity';
import { Visita } from './visita.entity';
import { Recuperacion } from './recuperacion.entity';

export enum EstadoVecino {
  CITA = 'CITA',
  INTERCONEXION = 'INTERCONEXIÓN',
  PENDIENTE = 'PENDIENTE',
  CANCELADO = 'CANCELADO',
}

@Entity('vecinos')
export class Vecino {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  celular: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: number;

  @Column({ nullable: true })
  nombre_gestor: string;

  @Column({ type: 'enum', enum: EstadoVecino, default: EstadoVecino.PENDIENTE })
  estado: EstadoVecino;

  @Column({ type: 'date', nullable: true })
  fecha_tentativa: string;

  @Column({ nullable: true })
  tiene_internet: boolean;

  @Column({ nullable: true })
  visualiza_camaras_celular: boolean;

  @Column({ nullable: true })
  aplicativo: string;

  @Column({ nullable: true })
  herramientas_extra: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ nullable: true })
  tipo_camara: string;

  @Column({ nullable: true })
  nombre_grabador: string;

  @Column({ nullable: true })
  contrasena: string;

  @Column({ nullable: true })
  num_camaras: number;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  mes: string;

  @Column({ type: 'date', nullable: true })
  fecha_registro: string;

  @OneToMany(() => CamaraVecino, (c) => c.vecino)
  camaras: CamaraVecino[];

  @OneToMany(() => Visita, (v) => v.vecino)
  visitas: Visita[];

  @OneToMany(() => Recuperacion, (r) => r.vecino)
  recuperaciones: Recuperacion[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
