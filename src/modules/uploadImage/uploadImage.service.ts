import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import FormData from 'form-data';
import type { ForwardHeaders } from './uplodImage.dto';
import type { UploadImageResponse } from './uploadImage.types';

@Injectable()
export class UploadImageService {
  async uploadImage(
    payload: {
      file: Express.Multer.File;
      imagePath: string;
    },
    headers: ForwardHeaders,
  ): Promise<UploadImageResponse> {
    const BASE = process.env.PHP_BASE_URL;
    const APP_TOKEN = process.env.PHP_APP_ACCESS_TOKEN;

    if (!BASE || !APP_TOKEN) {
      throw new InternalServerErrorException('Server configuration missing');
    }

    const form = new FormData();
    form.append('image_path', payload.imagePath);
    form.append('image', payload.file.buffer, {
      filename: payload.file.originalname,
      contentType: payload.file.mimetype,
    });

    try {
      const response: AxiosResponse<UploadImageResponse> = await axios.post(
        `${BASE}/api/app/v2/score/upload_image`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            Accept: 'application/json',
            'user-access-token': headers.userAccessToken,
            'app-access-token': APP_TOKEN,
            region: headers.region,
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 30_000,
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>;

        throw new InternalServerErrorException(axiosError.response?.data ?? 'Image upload failed');
      }

      throw new InternalServerErrorException('Image upload failed');
    }
  }
}
