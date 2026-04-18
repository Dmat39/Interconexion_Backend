import { Controller, Get, Query, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('reportes')
export class ReportesController {
  constructor(private svc: ReportesService) {}

  @Get('visitas-dia')
  async getVisitasDia(
    @Query('fecha') fecha: string,
    @Query('tecnico') tecnico: string,
    @Res() res: Response,
  ) {
    const buffer = await this.svc.getVisitasDia(fecha, tecnico);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="visitas_${fecha}.xlsx"`,
    });
    res.send(buffer);
  }

  @Get('ruta-grupo/:id')
  async getRutaGrupo(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.svc.getRutaGrupo(id);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="ruta_grupo_${id}.xlsx"`,
    });
    res.send(buffer);
  }
}
