import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { Vecino } from './vecino.entity';

@Entity('urbanizaciones')
export class Urbanizacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToMany(() => Vecino)
  @JoinTable({
    name: 'urbanizacion_vecinos',
    joinColumn: { name: 'urbanizacion_id' },
    inverseJoinColumn: { name: 'vecino_id' },
  })
  vecinos: Vecino[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}