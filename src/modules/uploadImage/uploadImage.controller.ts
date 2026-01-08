import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { IncomingHttpHeaders } from 'http';
import type { Express } from 'express';

import { UploadImageService } from './uploadImage.service';
import { UploadImageBodyDto } from './uplodImage.dto';
import type { UploadImageResponse } from './uploadImage.types';

@Controller('uploadImage')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post('upload_image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageBodyDto,
    @Headers() headers: IncomingHttpHeaders,
  ): Promise<UploadImageResponse> {
    if (!file) {
      throw new BadRequestException('image file is required');
    }

    if (!body.image_path) {
      throw new BadRequestException('image_path is required');
    }

    const bearer = headers.authorization;
    if (!bearer?.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization Bearer token required');
    }

    const region = typeof headers['x-region'] === 'string' ? headers['x-region'] : 'AUS';

    return this.uploadImageService.uploadImage(
      {
        file,
        imagePath: body.image_path,
      },
      {
        userAccessToken: bearer.replace('Bearer ', ''),
        region,
      },
    );
  }
}
