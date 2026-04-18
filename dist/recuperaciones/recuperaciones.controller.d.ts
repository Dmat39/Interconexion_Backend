import { RecuperacionesService } from './recuperaciones.service';
export declare class RecuperacionesController {
    private svc;
    constructor(svc: RecuperacionesService);
    findAll(query: any): Promise<import("../entities/recuperacion.entity").Recuperacion[]>;
    getPorSector(): Promise<any[]>;
    create(dto: any): Promise<import("../entities/recuperacion.entity").Recuperacion>;
    update(id: string, dto: any): Promise<import("../entities/recuperacion.entity").Recuperacion>;
}
