import { Visita } from './visita.entity';
export declare enum EstadoGrupo {
    PENDIENTE = "PENDIENTE",
    EN_CURSO = "EN_CURSO",
    COMPLETADO = "COMPLETADO"
}
export declare class GrupoVisita {
    id: string;
    nombre: string;
    tecnico: string;
    fecha: string;
    sector: string;
    estado: EstadoGrupo;
    observaciones: string;
    visitas: Visita[];
    created_at: Date;
    updated_at: Date;
}
