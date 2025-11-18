import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertToPdf(
    @UploadedFile() file: any,
    @Res() res: Response,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const pdfBuffer = await this.filesService.convertToPdf(file);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="converted.pdf"',
    });

    return res.send(pdfBuffer);
  }
}
