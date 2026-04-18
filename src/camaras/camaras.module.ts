import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CamarasController } from './camaras.controller';
import { CamarasService } from './camaras.service';
import { CamaraVecino } from '../entities/camara-vecino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CamaraVecino])],
  controllers: [CamarasController],
  providers: [CamarasService],
  exports: [CamarasService],
})
export class CamarasModule {}
