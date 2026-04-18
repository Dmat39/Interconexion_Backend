import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Visita) private visitaRepo: Repository<Visita>,
    @InjectRepository(GrupoVisita) private grupoRepo: Repository<GrupoVisita>,
  ) {}

  async getVisitasDia(fecha: string, tecnico?: string): Promise<Buffer> {
    const qb = this.visitaRepo.createQueryBuilder('v')
      .leftJoinAndSelect('v.vecino', 'vec')
      .leftJoinAndSelect('v.grupo', 'g')
      .where('v.fecha_programada = :fecha', { fecha });
    if (tecnico) qb.andWhere('v.tecnico ILIKE :tecnico', { tecnico: `%${tecnico}%` });
    qb.orderBy('g.nombre', 'ASC').addOrderBy('v.orden', 'ASC');
    const visitas = await qb.getMany();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Visitas del Día');
    ws.columns = [
      { header: 'N°', key: 'n', width: 5 },
      { header: 'Grupo', key: 'grupo', width: 25 },
      { header: 'Nombre Vecino', key: 'nombre', width: 30 },
      { header: 'Dirección', key: 'direccion', width: 35 },
      { header: 'Celular', key: 'celular', width: 15 },
      { header: 'Sector', key: 'sector', width: 20 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Observaciones', key: 'observaciones', width: 30 },
    ];
    ws.getRow(1).font = { bold: true };
    visitas.forEach((v, i) => {
      ws.addRow({
        n: i + 1,
        grupo: v.grupo?.nombre || 'Individual',
        nombre: v.vecino?.nombre,
        direccion: v.vecino?.direccion,
        celular: v.vecino?.celular,
        sector: v.vecino?.sector,
        estado: v.estado,
        observaciones: v.observaciones,
      });
    });
    return wb.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }

  async getRutaGrupo(grupoId: string): Promise<Buffer> {
    const visitas = await this.visitaRepo.find({
      where: { grupo_id: grupoId },
      relations: ['vecino'],
      order: { orden: 'ASC' },
    });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Ruta del Grupo');
    ws.columns = [
      { header: 'N°', key: 'n', width: 5 },
      { header: 'Nombre', key: 'nombre', width: 30 },
      { header: 'Dirección', key: 'direccion', width: 35 },
      { header: 'Celular', key: 'celular', width: 15 },
      { header: 'Lat', key: 'lat', width: 15 },
      { header: 'Lng', key: 'lng', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
    ];
    ws.getRow(1).font = { bold: true };
    visitas.forEach((v, i) => {
      ws.addRow({
        n: i + 1,
        nombre: v.vecino?.nombre,
        direccion: v.vecino?.direccion,
        celular: v.vecino?.celular,
        lat: v.vecino?.lat,
        lng: v.vecino?.lng,
        estado: v.estado,
      });
    });
    return wb.xlsx.writeBuffer() as unknown as Promise<Buffer>;
  }
}
