import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CamaraVecino } from '../entities/camara-vecino.entity';

@Injectable()
export class CamarasService {
  constructor(@InjectRepository(CamaraVecino) private repo: Repository<CamaraVecino>) {}

  findByVecino(vecinoId: string) {
    return this.repo.find({ where: { vecino_id: vecinoId }, order: { numero_camara: 'ASC' } });
  }

  async create(vecinoId: string, dto: Partial<CamaraVecino>) {
    const camara = this.repo.create({ ...dto, vecino_id: vecinoId });
    return this.repo.save(camara);
  }

  async update(id: string, dto: Partial<CamaraVecino>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }

  async remove(id: string) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException();
    return this.repo.remove(c);
  }
}
