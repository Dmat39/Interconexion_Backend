import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivasService } from './activas.service';

@Controller('activas')
export class ActivasController {
  constructor(private readonly svc: ActivasService) {}

  @Get()
  findAll(@Query() query: any) { return this.svc.findAll(query); }

  @Get('sectores')
  getSectores() { return this.svc.getSectores(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post()
  create(@Body() dto: any) { return this.svc.create(dto); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.svc.remove(id); }

  @Post('importar')
  @UseInterceptors(FileInterceptor('file'))
  importar(@UploadedFile() file: Express.Multer.File) {
    return this.svc.importarExcel(file.buffer);
  }
}