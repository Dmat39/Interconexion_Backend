import { GruposService } from './grupos.service';
export declare class GruposController {
    private svc;
    constructor(svc: GruposService);
    findAll(query: any): Promise<import("../entities/grupo-visita.entity").GrupoVisita[]>;
    findHoy(): Promise<import("../entities/grupo-visita.entity").GrupoVisita[]>;
    findOne(id: string): Promise<import("../entities/grupo-visita.entity").GrupoVisita>;
    create(dto: any): Promise<import("../entities/grupo-visita.entity").GrupoVisita>;
    update(id: string, dto: any): Promise<import("../entities/grupo-visita.entity").GrupoVisita>;
    agregarVecinos(id: string, body: {
        vecino_ids: {
            id: string;
            orden?: number;
        }[];
    }): Promise<import("../entities/grupo-visita.entity").GrupoVisita>;
    updateVecinoEstado(id: string, vecinoId: string, body: any): Promise<import("../entities/visita.entity").Visita>;
    remove(id: string): Promise<import("../entities/grupo-visita.entity").GrupoVisita>;
}
