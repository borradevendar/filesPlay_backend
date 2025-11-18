import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as util from 'util';
import * as path from 'path';
import { exec } from 'child_process';

const execPromise = util.promisify(exec);

@Injectable()
export class FilesService {
  async convertToPdf(file: any): Promise<Buffer> {
    const tempDir = '/tmp/filesplay';
    await fs.mkdir(tempDir, { recursive: true });

    const inputPath = path.join(tempDir, file.originalname);
    const outputPath = inputPath.replace(/\.[^.]+$/, '.pdf');

    try {
      // Save input file to disk
      await fs.writeFile(inputPath, file.buffer);

      // Convert using LibreOffice
      await execPromise(
        `soffice --headless --convert-to pdf "${inputPath}" --outdir "${tempDir}"`
      );

      // Read PDF
      const pdfBuffer = await fs.readFile(outputPath);

      return pdfBuffer;
    } catch (err) {
      console.error('Conversion failed:', err);
      throw new HttpException('Conversion failed', HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // Clean up temp files
      fs.unlink(inputPath).catch(() => {});
      fs.unlink(outputPath).catch(() => {});
    }
  }
}
