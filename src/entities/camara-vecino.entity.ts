import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Vecino } from './vecino.entity';

@Entity('camaras_vecino')
export class CamaraVecino {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vecino, (v) => v.camaras, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vecino_id' })
  vecino: Vecino;

  @Column()
  vecino_id: string;

  @Column()
  numero_camara: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  lng: number;

  @Column({ nullable: true })
  descripcion: string;

  @CreateDateColumn()
  created_at: Date;
}
