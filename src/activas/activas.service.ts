import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VecinalActiva, EstadoVecinal } from '../entities/vecinal-activa.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class ActivasService {
  constructor(
    @InjectRepository(VecinalActiva) private repo: Repository<VecinalActiva>,
    @InjectRepository(Recuperacion) private recuperacionRepo: Repository<Recuperacion>,
  ) {}

  async findAll(query: any) {
    const { buscar, estado, sector } = query;
    const qb = this.repo.createQueryBuilder('v')
      .leftJoinAndSelect('v.vecino', 'vecino');

    if (estado) qb.andWhere('v.estado = :estado', { estado });
    if (sector) qb.andWhere('v.sector = :sector', { sector });
    if (buscar) {
      qb.andWhere(
        '(v.nombre ILIKE :buscar OR v.direccion ILIKE :buscar OR v.sector ILIKE :buscar)',
        { buscar: `%${buscar}%` },
      );
    }

    return qb.orderBy('v.created_at', 'DESC').getMany();
  }

  async findOne(id: string) {
    const v = await this.repo.findOne({ where: { id }, relations: ['vecino'] });
    if (!v) throw new NotFoundException('Vecinal activa no encontrada');
    return v;
  }

  async create(dto: Partial<VecinalActiva>) {
    const v = this.repo.create(dto);
    return this.repo.save(v);
  }

  async update(id: string, dto: Partial<VecinalActiva>) {
    const vecinal = await this.findOne(id);

    if (dto.estado === EstadoVecinal.RECUPERAR && vecinal.estado !== EstadoVecinal.RECUPERAR) {
      const recuperacion = this.recuperacionRepo.create({
        vecino_id: vecinal.vecino_id,
        sector: vecinal.sector,
        fecha_recuperacion: new Date().toISOString().split('T')[0],
        tecnico: vecinal.tecnico,
        observaciones: `Recuperación automática desde Vecinales Activas: ${vecinal.nombre}`,
      });
      await this.recuperacionRepo.save(recuperacion);
    }

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

  async importarExcel(buffer: Buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(ws);

    const results = [];
    for (const row of rows) {
      const nombre = row['nombre'] || row['Nombre'];
      if (!nombre) continue;

      const v = this.repo.create({
        nombre,
        direccion: row['direccion'] || row['Dirección'] || row['Direccion'],
        sector: row['sector'] || row['Sector'],
        tecnico: row['tecnico'] || row['Técnico'],
        num_camaras: row['num_camaras'] || row['Cámaras'] || row['camaras'],
        observaciones: row['observaciones'] || row['Observaciones'],
        estado: EstadoVecinal.ACTIVA,
      });
      results.push(await this.repo.save(v));
    }

    return { importados: results.length };
  }
}