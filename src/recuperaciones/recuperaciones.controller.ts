import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RecuperacionesService } from './recuperaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('recuperaciones')
export class RecuperacionesController {
  constructor(private svc: RecuperacionesService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.svc.findAll(query);
  }

  @Get('por-sector')
  getPorSector() {
    return this.svc.getPorSector();
  }

  @Post()
  create(@Body() dto: any) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }
}
