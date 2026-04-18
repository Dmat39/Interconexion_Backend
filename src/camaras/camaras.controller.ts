import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CamarasService } from './camaras.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class CamarasController {
  constructor(private svc: CamarasService) {}

  @Get('vecinos/:id/camaras')
  findByVecino(@Param('id') id: string) {
    return this.svc.findByVecino(id);
  }

  @Post('vecinos/:id/camaras')
  create(@Param('id') id: string, @Body() dto: any) {
    return this.svc.create(id, dto);
  }

  @Patch('camaras/:id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete('camaras/:id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
