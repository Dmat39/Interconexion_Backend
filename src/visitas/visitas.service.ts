import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Visita, EstadoVisita } from '../entities/visita.entity';

@Injectable()
export class VisitasService {
  constructor(@InjectRepository(Visita) private repo: Repository<Visita>) {}

  async findAll(query: any) {
    const { fecha, tecnico, estado, grupoId } = query;
    const qb = this.repo.createQueryBuilder('v')
      .leftJoinAndSelect('v.vecino', 'vec')
      .leftJoinAndSelect('v.grupo', 'g');
    if (fecha) qb.andWhere('v.fecha_programada = :fecha', { fecha });
    if (tecnico) qb.andWhere('v.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
    if (estado) qb.andWhere('v.estado = :estado', { estado });
    if (grupoId) qb.andWhere('v.grupo_id = :grupoId', { grupoId });
    qb.orderBy('v.fecha_programada', 'DESC').addOrderBy('v.orden', 'ASC');
    return qb.getMany();
  }

  async getCalendario(inicio: string, fin: string) {
    return this.repo.find({
      where: { fecha_programada: Between(inicio as any, fin as any) },
      relations: ['vecino', 'grupo'],
      order: { fecha_programada: 'ASC' },
    });
  }

  async create(dto: Partial<Visita>) {
    const v = this.repo.create(dto);
    return this.repo.save(v);
  }

  async update(id: string, dto: Partial<Visita>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, relations: ['vecino', 'grupo'] });
  }

  async reprogramar(id: string, nuevaFecha: string, observaciones?: string) {
    const original = await this.repo.findOne({ where: { id } });
    if (!original) throw new NotFoundException();
    original.estado = EstadoVisita.REPROGRAMAR;
    if (observaciones) original.observaciones = observaciones;
    await this.repo.save(original);

    const nueva = this.repo.create({
      vecino_id: original.vecino_id,
      tecnico: original.tecnico,
      fecha_programada: nuevaFecha,
      estado: EstadoVisita.PROGRAMADA,
      observaciones: `Reprogramada desde visita del ${original.fecha_programada}`,
    });
    return this.repo.save(nueva);
  }
}
