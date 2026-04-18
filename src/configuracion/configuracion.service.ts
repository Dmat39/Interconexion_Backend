import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class ConfiguracionService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  findAll() {
    return this.repo.find({ select: ['id', 'nombre', 'username', 'rol', 'activo', 'created_at'] });
  }

  async create(dto: Partial<Usuario>) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const u = this.repo.create({ ...dto, password: hashed });
    const saved = await this.repo.save(u);
    const { password, ...rest } = saved as any;
    return rest;
  }

  async update(id: string, dto: Partial<Usuario>) {
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id }, select: ['id', 'nombre', 'username', 'rol', 'activo'] });
  }

  async remove(id: string) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException();
    return this.repo.remove(u);
  }
}
