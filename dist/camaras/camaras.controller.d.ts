import { CamarasService } from './camaras.service';
export declare class CamarasController {
    private svc;
    constructor(svc: CamarasService);
    findByVecino(id: string): Promise<import("../entities/camara-vecino.entity").CamaraVecino[]>;
    create(id: string, dto: any): Promise<import("../entities/camara-vecino.entity").CamaraVecino>;
    update(id: string, dto: any): Promise<import("../entities/camara-vecino.entity").CamaraVecino>;
    remove(id: string): Promise<import("../entities/camara-vecino.entity").CamaraVecino>;
}
