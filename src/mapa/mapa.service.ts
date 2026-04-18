import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';

@Injectable()
export class MapaService {
  constructor(
    @InjectRepository(Vecino) private vecinoRepo: Repository<Vecino>,
    @InjectRepository(CamaraVecino) private camaraRepo: Repository<CamaraVecino>,
    @InjectRepository(Visita) private visitaRepo: Repository<Visita>,
    @InjectRepository(GrupoVisita) private grupoRepo: Repository<GrupoVisita>,
  ) {}

  async getVecinos() {
    return this.vecinoRepo.createQueryBuilder('v')
      .select(['v.id', 'v.nombre', 'v.direccion', 'v.lat', 'v.lng', 'v.estado', 'v.sector', 'v.num_camaras', 'v.nombre_gestor'])
      .where('v.lat IS NOT NULL AND v.lng IS NOT NULL')
      .getMany();
  }

  async getCamaras() {
    const camaras = await this.camaraRepo.find({ relations: ['vecino'] });
    return camaras
      .filter(c => c.lat && c.lng)
      .map(c => ({
        id: c.id,
        vecino_id: c.vecino_id,
        numero_camara: c.numero_camara,
        lat: Number(c.lat),
        lng: Number(c.lng),
        vecino_nombre: c.vecino?.nombre || '',
      }));
  }

  async getGrupos() {
    return this.grupoRepo.find({
      select: ['id', 'nombre', 'fecha', 'tecnico', 'sector', 'estado'],
      order: { fecha: 'DESC', created_at: 'DESC' },
    });
  }

  async getRutaGrupo(id: string) {
    const visitas = await this.visitaRepo.find({
      where: { grupo_id: id },
      relations: ['vecino'],
      order: { orden: 'ASC' },
    });
    const grupo = await this.grupoRepo.findOne({ where: { id } });
    return {
      grupo,
      paradas: visitas
        .filter(v => v.vecino?.lat && v.vecino?.lng)
        .map((v, idx) => ({
          orden: v.orden ?? idx + 1,
          estado: v.estado,
          vecino: {
            id: v.vecino.id,
            nombre: v.vecino.nombre,
            direccion: v.vecino.direccion,
            lat: Number(v.vecino.lat),
            lng: Number(v.vecino.lng),
            celular: v.vecino.celular,
            num_camaras: v.vecino.num_camaras,
            estado: v.vecino.estado,
          },
        })),
    };
  }
}
