import { Repository } from 'typeorm';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Visita, EstadoVisita } from '../entities/visita.entity';
import { Vecino } from '../entities/vecino.entity';
export declare class GruposService {
    private grupoRepo;
    private visitaRepo;
    private vecinoRepo;
    constructor(grupoRepo: Repository<GrupoVisita>, visitaRepo: Repository<Visita>, vecinoRepo: Repository<Vecino>);
    findAll(query: any): Promise<GrupoVisita[]>;
    findHoy(): Promise<GrupoVisita[]>;
    findOne(id: string): Promise<GrupoVisita>;
    create(dto: {
        nombre: string;
        tecnico: string;
        fecha: string;
        sector?: string;
        observaciones?: string;
        vecino_ids: {
            id: string;
            orden: number;
        }[];
    }): Promise<GrupoVisita>;
    update(id: string, dto: any): Promise<GrupoVisita>;
    updateVecinoEstado(grupoId: string, vecinoId: string, estado: EstadoVisita, observaciones?: string, resultado?: string): Promise<Visita>;
    agregarVecinos(id: string, vecino_ids: {
        id: string;
        orden?: number;
    }[]): Promise<GrupoVisita>;
    remove(id: string): Promise<GrupoVisita>;
}
