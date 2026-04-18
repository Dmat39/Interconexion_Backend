import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecuperacionesController } from './recuperaciones.controller';
import { RecuperacionesService } from './recuperaciones.service';
import { Recuperacion } from '../entities/recuperacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recuperacion])],
  controllers: [RecuperacionesController],
  providers: [RecuperacionesService],
  exports: [RecuperacionesService],
})
export class RecuperacionesModule {}
