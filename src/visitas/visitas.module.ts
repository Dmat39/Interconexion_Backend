import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitasController } from './visitas.controller';
import { VisitasService } from './visitas.service';
import { Visita } from '../entities/visita.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita])],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}
