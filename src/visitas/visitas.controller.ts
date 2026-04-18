import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('visitas')
export class VisitasController {
  constructor(private svc: VisitasService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.svc.findAll(query);
  }

  @Get('calendario')
  getCalendario(@Query('inicio') inicio: string, @Query('fin') fin: string) {
    return this.svc.getCalendario(inicio, fin);
  }

  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Post(':id/reprogramar')
  reprogramar(@Param('id') id: string, @Body() body: any) {
    return this.svc.reprogramar(id, body.nuevaFecha, body.observaciones);
  }
}
