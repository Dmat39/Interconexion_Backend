import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Recuperacion } from '../entities/recuperacion.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectRepository(Vecino) private vecinoRepo: Repository<Vecino>,
    @InjectRepository(CamaraVecino) private camaraRepo: Repository<CamaraVecino>,
    @InjectRepository(Visita) private visitaRepo: Repository<Visita>,
    @InjectRepository(GrupoVisita) private grupoRepo: Repository<GrupoVisita>,
    @InjectRepository(Recuperacion) private recuperacionRepo: Repository<Recuperacion>,
  ) {}

  async getResumen() {
    const hoy = new Date().toISOString().split('T')[0];

    const [total_vecinos, total_camaras] = await Promise.all([
      this.vecinoRepo.count(),
      this.camaraRepo.count(),
    ]);

    const por_estado_raw = await this.vecinoRepo
      .createQueryBuilder('v')
      .select('v.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .groupBy('v.estado')
      .getRawMany();
    const por_estado = { CITA: 0, 'INTERCONEXIÓN': 0, PENDIENTE: 0, CANCELADO: 0 };
    por_estado_raw.forEach((r) => { por_estado[r.estado] = parseInt(r.total); });

    const por_sector = await this.vecinoRepo
      .createQueryBuilder('v')
      .select('v.sector', 'sector')
      .addSelect('COUNT(*)', 'total')
      .where('v.sector IS NOT NULL')
      .groupBy('v.sector')
      .getRawMany();

    const recuperados_sector = await this.recuperacionRepo
      .createQueryBuilder('r')
      .select('r.sector', 'sector')
      .addSelect('COUNT(*)', 'total')
      .groupBy('r.sector')
      .getRawMany();

    const por_sector_merged = por_sector.map((s) => ({
      sector: s.sector,
      total: parseInt(s.total),
      recuperados: parseInt(recuperados_sector.find((r) => r.sector === s.sector)?.total || '0'),
    }));

    const por_tecnico = await this.visitaRepo
      .createQueryBuilder('v')
      .select('v.tecnico', 'tecnico')
      .addSelect('COUNT(*)', 'total_visitas')
      .addSelect("SUM(CASE WHEN v.estado = 'COMPLETADA' THEN 1 ELSE 0 END)", 'completadas')
      .groupBy('v.tecnico')
      .getRawMany();

    const [grupos_hoy, visitas_hoy] = await Promise.all([
      this.grupoRepo.count({ where: { fecha: hoy } }),
      this.visitaRepo.count({ where: { fecha_programada: hoy as any } }),
    ]);

    return {
      total_vecinos,
      total_camaras,
      por_estado,
      por_sector: por_sector_merged,
      por_tecnico: por_tecnico.map((t) => ({
        tecnico: t.tecnico,
        total_visitas: parseInt(t.total_visitas),
        completadas: parseInt(t.completadas),
      })),
      grupos_hoy,
      visitas_hoy,
    };
  }
}
