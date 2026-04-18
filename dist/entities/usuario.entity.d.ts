export declare enum RolUsuario {
    ADMIN = "ADMIN",
    TECNICO = "TECNICO"
}
export declare class Usuario {
    id: string;
    nombre: string;
    username: string;
    password: string;
    rol: RolUsuario;
    activo: boolean;
    created_at: Date;
}
