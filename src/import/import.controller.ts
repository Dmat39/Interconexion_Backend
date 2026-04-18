import {
  Controller, Post, Get, UseGuards, UseInterceptors,
  UploadedFile, HttpException, HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ImportService } from './import.service';
import { memoryStorage } from 'multer';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('import')
export class ImportController {
  constructor(private svc: ImportService) {}

  @Post('excel')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('No se recibió archivo', HttpStatus.BAD_REQUEST);
    return this.svc.importExcel(file.buffer, false);
  }

  @Post('preview')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async preview(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new HttpException('No se recibió archivo', HttpStatus.BAD_REQUEST);
    return this.svc.importExcel(file.buffer, true);
  }
}
