import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../entities/usuario.entity';
export declare class AuthService {
    private usuariosRepo;
    private jwtService;
    constructor(usuariosRepo: Repository<Usuario>, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        access_token: string;
        usuario: {
            id: string;
            nombre: string;
            username: string;
            rol: import("../entities/usuario.entity").RolUsuario;
        };
    }>;
    cambiarPassword(userId: string, passwordActual: string, passwordNueva: string): Promise<Usuario>;
}
