import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GruposController } from './grupos.controller';
import { GruposService } from './grupos.service';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Urbanizacion } from '../entities/urbanizacion.entity';
import { Visita } from '../entities/visita.entity';
import { Vecino } from '../entities/vecino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GrupoVisita, Visita, Vecino, Urbanizacion])],
  controllers: [GruposController],
  providers: [GruposService],
  exports: [GruposService],
})
export class GruposModule {}
