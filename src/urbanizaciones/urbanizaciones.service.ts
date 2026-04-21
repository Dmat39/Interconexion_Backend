import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Urbanizacion } from '../entities/urbanizacion.entity';
import { Vecino } from '../entities/vecino.entity';
import * as XLSX from 'xlsx';

@Injectable()
export class UrbanizacionesService {
  constructor(
    @InjectRepository(Urbanizacion) private repo: Repository<Urbanizacion>,
    @InjectRepository(Vecino) private vecinoRepo: Repository<Vecino>,
  ) {}

  async findAll() {
    return this.repo.find({
      relations: ['vecinos'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const u = await this.repo.findOne({
      where: { id },
      relations: ['vecinos', 'vecinos.camaras'],
    });
    if (!u) throw new NotFoundException('Urbanización no encontrada');
    return u;
  }

  async create(dto: { nombre: string; sector?: string; descripcion?: string }) {
    const u = this.repo.create(dto);
    return this.repo.save(u);
  }

  async update(id: string, dto: Partial<Urbanizacion>) {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const u = await this.findOne(id);
    return this.repo.remove(u);
  }

  async asignarVecinos(id: string, vecinoIds: string[]) {
    const u = await this.findOne(id);
    const vecinos = await this.vecinoRepo.find({ where: { id: In(vecinoIds) } });
    const existingIds = new Set(u.vecinos.map(v => v.id));
    for (const v of vecinos) {
      if (!existingIds.has(v.id)) u.vecinos.push(v);
    }
    return this.repo.save(u);
  }

  async quitarVecino(id: string, vecinoId: string) {
    const u = await this.findOne(id);
    u.vecinos = u.vecinos.filter(v => v.id !== vecinoId);
    return this.repo.save(u);
  }

  async importarExcel(id: string, buffer: Buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(ws);

    const u = await this.findOne(id);
    const existingIds = new Set(u.vecinos.map(v => v.id));

    for (const row of rows) {
      const nombre = row['nombre'] || row['Nombre'];
      if (!nombre) continue;

      let vecino = await this.vecinoRepo.findOne({ where: { nombre } });
      if (!vecino) {
        vecino = this.vecinoRepo.create({
          nombre,
          celular: row['celular'] || row['Celular'],
          direccion: row['direccion'] || row['Dirección'] || row['Direccion'],
          sector: row['sector'] || row['Sector'],
          nombre_gestor: row['tecnico'] || row['Técnico'] || row['nombre_gestor'],
        });
        vecino = await this.vecinoRepo.save(vecino);
      }

      if (!existingIds.has(vecino.id)) {
        u.vecinos.push(vecino);
        existingIds.add(vecino.id);
      }
    }

    return this.repo.save(u);
  }
}