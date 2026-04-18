import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
        usuario: {
            id: string;
            nombre: string;
            username: string;
            rol: import("../entities/usuario.entity").RolUsuario;
        };
    }>;
    cambiarPassword(req: any, body: {
        passwordActual: string;
        passwordNueva: string;
    }): Promise<import("../entities/usuario.entity").Usuario>;
}
