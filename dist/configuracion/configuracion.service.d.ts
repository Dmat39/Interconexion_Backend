import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
export declare class ConfiguracionService {
    private repo;
    constructor(repo: Repository<Usuario>);
    findAll(): Promise<Usuario[]>;
    create(dto: Partial<Usuario>): Promise<any>;
    update(id: string, dto: Partial<Usuario>): Promise<Usuario>;
    remove(id: string): Promise<Usuario>;
}
