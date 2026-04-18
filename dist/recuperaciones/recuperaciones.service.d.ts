import { Repository } from 'typeorm';
import { Recuperacion } from '../entities/recuperacion.entity';
export declare class RecuperacionesService {
    private repo;
    constructor(repo: Repository<Recuperacion>);
    findAll(query: any): Promise<Recuperacion[]>;
    getPorSector(): Promise<any[]>;
    create(dto: Partial<Recuperacion>): Promise<Recuperacion>;
    update(id: string, dto: Partial<Recuperacion>): Promise<Recuperacion>;
}
