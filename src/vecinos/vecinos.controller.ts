import {
  Controller, Get, Post, Patch, Delete, Param, Body,
  Query, UseGuards, Request,
} from '@nestjs/common';
import { VecinosService } from './vecinos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vecinos')
export class VecinosController {
  constructor(private svc: VecinosService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.svc.findAll(query);
  }

  @Get('sectores')
  getSectores() {
    return this.svc.getSectores();
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

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
