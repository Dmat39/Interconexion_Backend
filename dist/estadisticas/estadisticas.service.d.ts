import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
export declare class EstadisticasService {
    private vecinoRepo;
    private camaraRepo;
    private visitaRepo;
    private grupoRepo;
    private recuperacionRepo;
    constructor(vecinoRepo: Repository<Vecino>, camaraRepo: Repository<CamaraVecino>, visitaRepo: Repository<Visita>, grupoRepo: Repository<GrupoVisita>, recuperacionRepo: Repository<Recuperacion>);
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
