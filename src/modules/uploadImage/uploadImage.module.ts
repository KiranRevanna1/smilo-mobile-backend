import { Module } from '@nestjs/common';
import { UploadImageController } from './uploadImage.controller';
import { UploadImageService } from './uploadImage.service';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService],
})
export class UploadImageModule {}
