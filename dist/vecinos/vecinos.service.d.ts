import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
export declare class VecinosService {
    private repo;
    private camaraRepo;
    constructor(repo: Repository<Vecino>, camaraRepo: Repository<CamaraVecino>);
    findAll(query: any): Promise<{
        data: Vecino[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    findOne(id: string): Promise<Vecino>;
    create(dto: Partial<Vecino>): Promise<Vecino>;
    update(id: string, dto: Partial<Vecino>): Promise<Vecino>;
    remove(id: string): Promise<Vecino>;
    getSectores(): Promise<any[]>;
}
