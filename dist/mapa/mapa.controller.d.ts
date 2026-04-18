import { MapaService } from './mapa.service';
export declare class MapaController {
    private svc;
    constructor(svc: MapaService);
    getVecinos(): Promise<import("../entities/vecino.entity").Vecino[]>;
    getCamaras(): Promise<{
        id: string;
        vecino_id: string;
        numero_camara: number;
        lat: number;
        lng: number;
        vecino_nombre: string;
    }[]>;
    getGrupos(): Promise<import("../entities/grupo-visita.entity").GrupoVisita[]>;
    getRutaGrupo(id: string): Promise<{
        grupo: import("../entities/grupo-visita.entity").GrupoVisita;
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
