import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Urbanizacion } from '../entities/urbanizacion.entity';
import { Vecino } from '../entities/vecino.entity';
import { UrbanizacionesService } from './urbanizaciones.service';
import { UrbanizacionesController } from './urbanizaciones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Urbanizacion, Vecino])],
  controllers: [UrbanizacionesController],
  providers: [UrbanizacionesService],
  exports: [UrbanizacionesService],
})
export class UrbanizacionesModule {}