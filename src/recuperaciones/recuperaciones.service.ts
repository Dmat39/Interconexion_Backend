import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recuperacion } from '../entities/recuperacion.entity';

@Injectable()
export class RecuperacionesService {
  constructor(@InjectRepository(Recuperacion) private repo: Repository<Recuperacion>) {}

  async findAll(query: any) {
    const { sector, tecnico, fecha } = query;
    const qb = this.repo.createQueryBuilder('r')
      .leftJoinAndSelect('r.vecino', 'v');
    if (sector) qb.andWhere('r.sector ILIKE :sector', { sector: `%${sector}%` });
    if (tecnico) qb.andWhere('r.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
    if (fecha) qb.andWhere('r.fecha_recuperacion = :fecha', { fecha });
    qb.orderBy('r.fecha_recuperacion', 'DESC');
    return qb.getMany();
  }

  async getPorSector() {
    return this.repo.createQueryBuilder('r')
      .select('r.sector', 'sector')
      .addSelect('COUNT(*)', 'total')
      .groupBy('r.sector')
      .orderBy('total', 'DESC')
      .getRawMany();
  }

  async create(dto: Partial<Recuperacion>) {
    const r = this.repo.create(dto);
    return this.repo.save(r);
  }

  async update(id: string, dto: Partial<Recuperacion>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, relations: ['vecino'] });
  }
}
