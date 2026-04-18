import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapaController } from './mapa.controller';
import { MapaService } from './mapa.service';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vecino, CamaraVecino, Visita, GrupoVisita])],
  controllers: [MapaController],
  providers: [MapaService],
})
export class MapaModule {}
