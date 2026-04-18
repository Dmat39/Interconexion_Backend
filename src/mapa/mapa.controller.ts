import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MapaService } from './mapa.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('mapa')
export class MapaController {
  constructor(private svc: MapaService) {}

  @Get('vecinos')
  getVecinos() { return this.svc.getVecinos(); }

  @Get('camaras')
  getCamaras() { return this.svc.getCamaras(); }

  @Get('grupos')
  getGrupos() { return this.svc.getGrupos(); }

  @Get('grupo/:id')
  getRutaGrupo(@Param('id') id: string) { return this.svc.getRutaGrupo(id); }
}
