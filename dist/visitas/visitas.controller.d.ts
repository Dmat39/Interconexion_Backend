import { VisitasService } from './visitas.service';
export declare class VisitasController {
    private svc;
    constructor(svc: VisitasService);
    findAll(query: any): Promise<import("../entities/visita.entity").Visita[]>;
    getCalendario(inicio: string, fin: string): Promise<import("../entities/visita.entity").Visita[]>;
    create(dto: any): Promise<import("../entities/visita.entity").Visita>;
    update(id: string, dto: any): Promise<import("../entities/visita.entity").Visita>;
    reprogramar(id: string, body: any): Promise<import("../entities/visita.entity").Visita>;
}
