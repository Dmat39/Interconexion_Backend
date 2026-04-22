import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Urbanizacion } from '../entities/urbanizacion.entity';
import { VecinosService } from './vecinos.service';
import { VecinosController } from './vecinos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vecino, CamaraVecino, Urbanizacion])],
  controllers: [VecinosController],
  providers: [VecinosService],
  exports: [VecinosService],
})
export class VecinosModule {}