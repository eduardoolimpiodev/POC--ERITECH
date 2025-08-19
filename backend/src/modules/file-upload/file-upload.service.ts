import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_DEST') || './uploads';
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE') || 5242880;
    
    this.ensureDirectoriesExist();
  }

  private ensureDirectoriesExist(): void {
    const directories = [
      path.join(this.uploadPath, 'profiles'),
      path.join(this.uploadPath, 'temp'),
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds maximum allowed size of ${this.maxFileSize} bytes`);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF files are allowed');
    }
  }

  generateFileName(originalName: string, prefix: string = ''): string {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const extension = path.extname(originalName);
    return `${prefix}${timestamp}-${random}${extension}`;
  }

  deleteFile(filePath: string): boolean {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  getFileInfo(filePath: string): { exists: boolean; size?: number; mimeType?: string } {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        return {
          exists: true,
          size: stats.size,
          mimeType: this.getMimeTypeFromExtension(path.extname(filePath)),
        };
      }
      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  }

  private getMimeTypeFromExtension(ext: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
    };
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
  }
}
