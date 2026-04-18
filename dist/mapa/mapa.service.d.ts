import { Repository } from 'typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
export declare class MapaService {
    private vecinoRepo;
    private camaraRepo;
    private visitaRepo;
    private grupoRepo;
    constructor(vecinoRepo: Repository<Vecino>, camaraRepo: Repository<CamaraVecino>, visitaRepo: Repository<Visita>, grupoRepo: Repository<GrupoVisita>);
    getVecinos(): Promise<Vecino[]>;
    getCamaras(): Promise<{
        id: string;
        vecino_id: string;
        numero_camara: number;
        lat: number;
        lng: number;
        vecino_nombre: string;
    }[]>;
    getGrupos(): Promise<GrupoVisita[]>;
    getRutaGrupo(id: string): Promise<{
        grupo: GrupoVisita;
        paradas: {
            orden: number;
            estado: import("../entities/visita.entity").EstadoVisita;
            vecino: {
                id: string;
                nombre: string;
                direccion: string;
                lat: number;
                lng: number;
                celular: string;
                num_camaras: number;
                estado: import("../entities/vecino.entity").EstadoVecino;
            };
        }[];
    }>;
}
