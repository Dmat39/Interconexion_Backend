import { Response } from 'express';
import { ReportesService } from './reportes.service';
export declare class ReportesController {
    private svc;
    constructor(svc: ReportesService);
    getVisitasDia(fecha: string, tecnico: string, res: Response): Promise<void>;
    getRutaGrupo(id: string, res: Response): Promise<void>;
}
