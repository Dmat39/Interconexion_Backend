import { ConfiguracionService } from './configuracion.service';
export declare class ConfiguracionController {
    private svc;
    constructor(svc: ConfiguracionService);
    findAll(): Promise<import("../entities/usuario.entity").Usuario[]>;
    create(dto: any): Promise<any>;
    update(id: string, dto: any): Promise<import("../entities/usuario.entity").Usuario>;
    remove(id: string): Promise<import("../entities/usuario.entity").Usuario>;
}
