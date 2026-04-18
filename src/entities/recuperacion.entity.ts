import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Vecino } from './vecino.entity';

@Entity('recuperaciones')
export class Recuperacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vecino, (v) => v.recuperaciones, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vecino_id' })
  vecino: Vecino;

  @Column()
  vecino_id: string;

  @Column()
  sector: string;

  @Column({ type: 'date' })
  fecha_recuperacion: string;

  @Column()
  tecnico: string;

  @Column({ nullable: true })
  observaciones: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
