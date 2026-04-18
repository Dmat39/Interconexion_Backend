import { Controller, Get, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private svc: EstadisticasService) {}

  @Get('resumen')
  getResumen() { return this.svc.getResumen(); }
}
