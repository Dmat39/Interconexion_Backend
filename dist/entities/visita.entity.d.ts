import { Vecino } from './vecino.entity';
import { GrupoVisita } from './grupo-visita.entity';
export declare enum EstadoVisita {
    PROGRAMADA = "PROGRAMADA",
    COMPLETADA = "COMPLETADA",
    NO_ATENDIDO = "NO_ATENDIDO",
    REPROGRAMAR = "REPROGRAMAR"
}
export declare class Visita {
    id: string;
    vecino: Vecino;
    vecino_id: string;
    grupo: GrupoVisita;
    grupo_id: string;
    orden: number;
    fecha_programada: string;
    hora_programada: string;
    tecnico: string;
    estado: EstadoVisita;
    observaciones: string;
    resultado: string;
    created_at: Date;
    updated_at: Date;
}
