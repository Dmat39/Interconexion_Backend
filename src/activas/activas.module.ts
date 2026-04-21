import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VecinalActiva } from '../entities/vecinal-activa.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
import { ActivasService } from './activas.service';
import { ActivasController } from './activas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VecinalActiva, Recuperacion])],
  controllers: [ActivasController],
  providers: [ActivasService],
  exports: [ActivasService],
})
export class ActivasModule {}