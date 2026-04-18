import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VecinosController } from './vecinos.controller';
import { VecinosService } from './vecinos.service';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vecino, CamaraVecino, Visita])],
  controllers: [VecinosController],
  providers: [VecinosService],
  exports: [VecinosService],
})
export class VecinosModule {}
