import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Urbanizacion } from '../entities/urbanizacion.entity';

@Injectable()
export class VecinosService {
  constructor(
    @InjectRepository(Vecino) private repo: Repository<Vecino>,
    @InjectRepository(CamaraVecino) private camaraRepo: Repository<CamaraVecino>,
    @InjectRepository(Urbanizacion) private urbanizacionRepo: Repository<Urbanizacion>,
  ) {}

  async findAll(query: any) {
    const { estado, sector, gestor, buscar, page = 1, limit = 20 } = query;
    const p = Number(page), l = Number(limit);

    const qb = this.repo.createQueryBuilder('v');
    if (estado) qb.andWhere('v.estado = :estado', { estado });
    if (sector) qb.andWhere('v.sector = :sector', { sector });
    if (gestor) qb.andWhere('v.nombre_gestor ILIKE :gestor', { gestor: `%${gestor}%` });
    if (buscar) {
      qb.andWhere(
        '(v.nombre ILIKE :buscar OR v.direccion ILIKE :buscar OR v.celular ILIKE :buscar)',
        { buscar: `%${buscar}%` },
      );
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy('v.created_at', 'DESC')
      .skip((p - 1) * l)
      .take(l)
      .getMany();

    if (data.length > 0) {
      const ids = data.map(v => v.id);

      // Cargar cámaras
      const camaras = await this.camaraRepo.find({ where: { vecino_id: In(ids) } });
      const camaraMap = new Map<string, CamaraVecino[]>();
      for (const c of camaras) {
        if (!camaraMap.has(c.vecino_id)) camaraMap.set(c.vecino_id, []);
        camaraMap.get(c.vecino_id)!.push(c);
      }
      for (const v of data) v.camaras = camaraMap.get(v.id) || [];

      // Cargar urbanizaciones
      const urbs = await this.urbanizacionRepo
        .createQueryBuilder('u')
        .innerJoin('u.vecinos', 'v', 'v.id IN (:...ids)', { ids })
        .select(['u.id', 'u.nombre', 'u.sector'])
        .addSelect('v.id', 'vecino_id')
        .getRawMany();

      const urbMap = new Map<string, { id: string; nombre: string; sector: string }[]>();
      for (const u of urbs) {
        const vid = u.vecino_id;
        if (!urbMap.has(vid)) urbMap.set(vid, []);
        urbMap.get(vid)!.push({ id: u.u_id, nombre: u.u_nombre, sector: u.u_sector });
      }
      for (const v of data) (v as any).urbanizaciones = urbMap.get(v.id) || [];
    }

    return { data, total, page: p, limit: l, pages: Math.ceil(total / l) };
  }

  async findOne(id: string) {
    const v = await this.repo.findOne({
      where: { id },
      relations: ['camaras', 'visitas', 'visitas.grupo', 'urbanizaciones'],
    });
    if (!v) throw new NotFoundException('Vecino no encontrado');
    return v;
  }

  async create(dto: Partial<Vecino>) {
    const vecino = this.repo.create(dto);
    return this.repo.save(vecino);
  }

  async update(id: string, dto: Partial<Vecino>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const v = await this.findOne(id);
    return this.repo.remove(v);
  }

  async getSectores() {
    const result = await this.repo
      .createQueryBuilder('v')
      .select('DISTINCT v.sector', 'sector')
      .where('v.sector IS NOT NULL')
      .getRawMany();
    return result.map(r => r.sector).filter(Boolean);
  }
}