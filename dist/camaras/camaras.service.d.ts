import { Repository } from 'typeorm';
import { CamaraVecino } from '../entities/camara-vecino.entity';
export declare class CamarasService {
    private repo;
    constructor(repo: Repository<CamaraVecino>);
    findByVecino(vecinoId: string): Promise<CamaraVecino[]>;
    create(vecinoId: string, dto: Partial<CamaraVecino>): Promise<CamaraVecino>;
    update(id: string, dto: Partial<CamaraVecino>): Promise<CamaraVecino>;
    remove(id: string): Promise<CamaraVecino>;
}
