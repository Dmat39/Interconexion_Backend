import { Repository } from 'typeorm';
import { Visita } from '../entities/visita.entity';
export declare class VisitasService {
    private repo;
    constructor(repo: Repository<Visita>);
    findAll(query: any): Promise<Visita[]>;
    getCalendario(inicio: string, fin: string): Promise<Visita[]>;
    create(dto: Partial<Visita>): Promise<Visita>;
    update(id: string, dto: Partial<Visita>): Promise<Visita>;
    reprogramar(id: string, nuevaFecha: string, observaciones?: string): Promise<Visita>;
}
