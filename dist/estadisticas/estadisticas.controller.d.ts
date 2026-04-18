import { EstadisticasService } from './estadisticas.service';
export declare class EstadisticasController {
    private svc;
    constructor(svc: EstadisticasService);
    getResumen(): Promise<{
        total_vecinos: number;
        total_camaras: number;
        por_estado: {
            CITA: number;
            INTERCONEXIÓN: number;
            PENDIENTE: number;
            CANCELADO: number;
        };
        por_sector: {
            sector: any;
            total: number;
            recuperados: number;
        }[];
        por_tecnico: {
            tecnico: any;
            total_visitas: number;
            completadas: number;
        }[];
        grupos_hoy: number;
        visitas_hoy: number;
    }>;
}
