import { VecinosService } from './vecinos.service';
export declare class VecinosController {
    private svc;
    constructor(svc: VecinosService);
    findAll(query: any): Promise<{
        data: import("../entities/vecino.entity").Vecino[];
        total: number;
        page: number;
        limit: number;
        pages: number;
    }>;
    getSectores(): Promise<any[]>;
    findOne(id: string): Promise<import("../entities/vecino.entity").Vecino>;
    create(dto: any): Promise<import("../entities/vecino.entity").Vecino>;
    update(id: string, dto: any): Promise<import("../entities/vecino.entity").Vecino>;
    remove(id: string): Promise<import("../entities/vecino.entity").Vecino>;
}
