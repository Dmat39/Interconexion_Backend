import { CamaraVecino } from './camara-vecino.entity';
import { Visita } from './visita.entity';
import { Recuperacion } from './recuperacion.entity';
export declare enum EstadoVecino {
    CITA = "CITA",
    INTERCONEXION = "INTERCONEXI\u00D3N",
    PENDIENTE = "PENDIENTE",
    CANCELADO = "CANCELADO"
}
export declare class Vecino {
    id: string;
    nombre: string;
    celular: string;
    direccion: string;
    lat: number;
    lng: number;
    nombre_gestor: string;
    estado: EstadoVecino;
    fecha_tentativa: string;
    tiene_internet: boolean;
    visualiza_camaras_celular: boolean;
    aplicativo: string;
    herramientas_extra: string;
    marca: string;
    tipo_camara: string;
    nombre_grabador: string;
    contrasena: string;
    num_camaras: number;
    sector: string;
    mes: string;
    fecha_registro: string;
    camaras: CamaraVecino[];
    visitas: Visita[];
    recuperaciones: Recuperacion[];
    created_at: Date;
    updated_at: Date;
}
