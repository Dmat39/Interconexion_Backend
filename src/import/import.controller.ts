import {
  Controller, Post, UseGuards, UseInterceptors,
  UploadedFile, HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ImportService } from './import.service';
import { memoryStorage } from 'multer';

const fileInterceptor = () =>
  FileInterceptor('file', { storage: memoryStorage() });

const requireFile = (file: Express.Multer.File) => {
  if (!file) throw new HttpException('No se recibió archivo', HttpStatus.BAD_REQUEST);
};

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('import')
export class ImportController {
  constructor(private svc: ImportService) {}

  // ─── Hoja 1: Registro general ──────────────────────────────────────────
  @Post('excel/sheet1')
  @UseInterceptors(fileInterceptor())
  async importSheet1(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet1(file.buffer, false);
  }

  @Post('preview/sheet1')
  @UseInterceptors(fileInterceptor())
  async previewSheet1(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet1(file.buffer, true);
  }

  // ─── Hoja 2: Recuperaciones ────────────────────────────────────────────
  @Post('excel/sheet2')
  @UseInterceptors(fileInterceptor())
  async importSheet2(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet2(file.buffer, false);
  }

  @Post('preview/sheet2')
  @UseInterceptors(fileInterceptor())
  async previewSheet2(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet2(file.buffer, true);
  }

  // ─── Hoja 3: Visitas programadas ───────────────────────────────────────
  @Post('excel/sheet3')
  @UseInterceptors(fileInterceptor())
  async importSheet3(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet3(file.buffer, false);
  }

  @Post('preview/sheet3')
  @UseInterceptors(fileInterceptor())
  async previewSheet3(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importSheet3(file.buffer, true);
  }

  // ─── Legacy: importación completa (las 3 hojas juntas) ────────────────
  @Post('excel')
  @UseInterceptors(fileInterceptor())
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importExcel(file.buffer, false);
  }

  @Post('preview')
  @UseInterceptors(fileInterceptor())
  async preview(@UploadedFile() file: Express.Multer.File) {
    requireFile(file);
    return this.svc.importExcel(file.buffer, true);
  }
}