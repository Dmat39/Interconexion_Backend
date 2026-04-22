import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Visita, EstadoVisita } from '../entities/visita.entity';
import { Vecino } from '../entities/vecino.entity';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(GrupoVisita) private grupoRepo: Repository<GrupoVisita>,
    @InjectRepository(Visita) private visitaRepo: Repository<Visita>,
    @InjectRepository(Vecino) private vecinoRepo: Repository<Vecino>,
  ) {}

  async findAll(query: any) {
    const { fecha, tecnico, estado } = query;
    const qb = this.grupoRepo.createQueryBuilder('g')
      .leftJoinAndSelect('g.visitas', 'v')
      .leftJoinAndSelect('v.vecino', 'vec')
      .leftJoinAndSelect('g.urbanizacion', 'urb');
    if (fecha) qb.andWhere('g.fecha = :fecha', { fecha });
    if (tecnico) qb.andWhere('g.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
    if (estado) qb.andWhere('g.estado = :estado', { estado });
    qb.orderBy('g.fecha', 'DESC').addOrderBy('g.created_at', 'DESC');
    return qb.getMany();
  }

  async findHoy() {
    const hoy = new Date().toISOString().split('T')[0];
    return this.grupoRepo.find({
      where: { fecha: hoy },
      relations: ['visitas', 'visitas.vecino', 'urbanizacion'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: string) {
    const g = await this.grupoRepo.findOne({
      where: { id },
      relations: ['visitas', 'visitas.vecino', 'visitas.vecino.camaras', 'urbanizacion'],
    });
    if (!g) throw new NotFoundException('Grupo no encontrado');
    return g;
  }

  async create(dto: {
    nombre: string;
    tecnico: string;
    fecha: string;
    sector?: string;
    observaciones?: string;
    urbanizacion_id?: string;
    vecino_ids: { id: string; orden: number }[];
  }) {
    const grupo = this.grupoRepo.create({
      nombre: dto.nombre,
      tecnico: dto.tecnico,
      fecha: dto.fecha,
      sector: dto.sector,
      observaciones: dto.observaciones,
      urbanizacion_id: dto.urbanizacion_id || null,
    });
    const savedGrupo = await this.grupoRepo.save(grupo);

    for (const item of dto.vecino_ids) {
      const visita = this.visitaRepo.create({
        vecino_id: item.id,
        grupo_id: savedGrupo.id,
        orden: item.orden,
        fecha_programada: dto.fecha,
        tecnico: dto.tecnico,
        estado: EstadoVisita.PROGRAMADA,
      });
      await this.visitaRepo.save(visita);
    }
    return this.findOne(savedGrupo.id);
  }

  async update(id: string, dto: any) {
    await this.grupoRepo.update(id, dto);
    return this.findOne(id);
  }

  async updateVecinoEstado(grupoId: string, vecinoId: string, estado: EstadoVisita, observaciones?: string, resultado?: string) {
    const visita = await this.visitaRepo.findOne({ where: { grupo_id: grupoId, vecino_id: vecinoId } });
    if (!visita) throw new NotFoundException('Visita no encontrada en el grupo');
    visita.estado = estado;
    if (observaciones) visita.observaciones = observaciones;
    if (resultado) visita.resultado = resultado;
    return this.visitaRepo.save(visita);
  }

  async agregarVecinos(id: string, vecino_ids: { id: string; orden?: number }[]) {
    const grupo = await this.findOne(id);
    const maxOrden = grupo.visitas?.reduce((max, v) => Math.max(max, v.orden || 0), 0) || 0;
    for (let i = 0; i < vecino_ids.length; i++) {
      const item = vecino_ids[i];
      const yaExiste = grupo.visitas?.some(v => v.vecino_id === item.id);
      if (yaExiste) continue;
      const visita = this.visitaRepo.create({
        vecino_id: item.id,
        grupo_id: grupo.id,
        orden: item.orden ?? maxOrden + i + 1,
        fecha_programada: grupo.fecha,
        tecnico: grupo.tecnico,
        estado: EstadoVisita.PROGRAMADA,
      });
      await this.visitaRepo.save(visita);
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    const g = await this.findOne(id);
    return this.grupoRepo.remove(g);
  }
}