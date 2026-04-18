import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const usuario = await this.usuariosRepo.findOne({ where: { username, activo: true } });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, username: usuario.username, rol: usuario.rol };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: { id: usuario.id, nombre: usuario.nombre, username: usuario.username, rol: usuario.rol },
    };
  }

  async cambiarPassword(userId: string, passwordActual: string, passwordNueva: string) {
    const usuario = await this.usuariosRepo.findOne({ where: { id: userId } });
    if (!usuario) throw new UnauthorizedException();
    const valid = await bcrypt.compare(passwordActual, usuario.password);
    if (!valid) throw new UnauthorizedException('Contraseña actual incorrecta');
    usuario.password = await bcrypt.hash(passwordNueva, 10);
    return this.usuariosRepo.save(usuario);
  }
}
