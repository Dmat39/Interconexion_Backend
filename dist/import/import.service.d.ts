import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
import { Visita } from '../entities/visita.entity';
export interface ImportResult {
    vecinos_importados: number;
    vecinos_actualizados: number;
    camaras_importadas: number;
    recuperaciones_importadas: number;
    visitas_importadas: number;
    errores: string[];
}
export declare class ImportService {
    private vecinoRepo;
    private camaraRepo;
    private recuperacionRepo;
    private visitaRepo;
    constructor(vecinoRepo: Repository<Vecino>, camaraRepo: Repository<CamaraVecino>, recuperacionRepo: Repository<Recuperacion>, visitaRepo: Repository<Visita>);
    private parseCoord;
    private parseLatLng;
    private parseBoolean;
    private parseDate;
    private isHeaderRow;
    private isSectorRow;
    private upsertVecino;
    private buildVecinoFromRow;
    private processCamaras;
    importExcel(buffer: Buffer, dryRun?: boolean): Promise<ImportResult>;
}
