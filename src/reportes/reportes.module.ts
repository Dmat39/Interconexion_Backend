import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Visita } from '../entities/visita.entity';
import { GrupoVisita } from '../entities/grupo-visita.entity';
import { Vecino } from '../entities/vecino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, GrupoVisita, Vecino])],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
