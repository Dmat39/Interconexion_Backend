import { Vecino } from './vecino.entity';
export declare class Recuperacion {
    id: string;
    vecino: Vecino;
    vecino_id: string;
    sector: string;
    fecha_recuperacion: string;
    tecnico: string;
    observaciones: string;
    created_at: Date;
    updated_at: Date;
}
