import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UrbanizacionesService } from './urbanizaciones.service';

@Controller('urbanizaciones')
export class UrbanizacionesController {
  constructor(private readonly svc: UrbanizacionesService) {}

  @Get()
  findAll() { return this.svc.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  create(@Body() dto: { nombre: string; sector?: string; descripcion?: string }) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }

  @Post(':id/vecinos')
  asignarVecinos(@Param('id') id: string, @Body() body: { vecinoIds: string[] }) {
    return this.svc.asignarVecinos(id, body.vecinoIds);
  }

  @Delete(':id/vecinos/:vecinoId')
  quitarVecino(@Param('id') id: string, @Param('vecinoId') vecinoId: string) {
    return this.svc.quitarVecino(id, vecinoId);
  }

  @Post(':id/importar')
  @UseInterceptors(FileInterceptor('file'))
  importar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.svc.importarExcel(id, file.buffer);
  }
}