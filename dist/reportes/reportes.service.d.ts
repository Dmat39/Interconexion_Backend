import { Repository } from 'typeorm';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
export declare class ReportesService {
    private visitaRepo;
    private grupoRepo;
    constructor(visitaRepo: Repository<Visita>, grupoRepo: Repository<GrupoVisita>);
    getVisitasDia(fecha: string, tecnico?: string): Promise<Buffer>;
    getRutaGrupo(grupoId: string): Promise<Buffer>;
}
