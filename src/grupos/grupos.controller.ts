import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { GruposService } from './grupos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('grupos')
export class GruposController {
  constructor(private svc: GruposService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.svc.findAll(query);
  }

  @Get('hoy')
  findHoy() {
    return this.svc.findHoy();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Post(':id/vecinos')
  agregarVecinos(@Param('id') id: string, @Body() body: { vecino_ids: { id: string; orden?: number }[] }) {
    return this.svc.agregarVecinos(id, body.vecino_ids);
  }

  @Patch(':id/vecinos/:vecinoId')
  updateVecinoEstado(
    @Param('id') id: string,
    @Param('vecinoId') vecinoId: string,
    @Body() body: any,
  ) {
    return this.svc.updateVecinoEstado(id, vecinoId, body.estado, body.observaciones, body.resultado);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
