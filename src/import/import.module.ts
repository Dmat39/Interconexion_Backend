import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { Vecino } from '../entities/vecino.entity';
import { CamaraVecino } from '../entities/camara-vecino.entity';
import { Recuperacion } from '../entities/recuperacion.entity';
import { Visita } from '../entities/visita.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vecino, CamaraVecino, Recuperacion, Visita]),
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [ImportController],
  providers: [ImportService],
})
export class ImportModule {}
