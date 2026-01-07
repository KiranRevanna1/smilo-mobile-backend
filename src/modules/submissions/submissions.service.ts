import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { type AxiosError, type AxiosResponse } from 'axios';
import type { ForwardHeaders } from './submissions.dto';
import type { SubmitConsultResponse } from './submissions.types';

@Injectable()
export class SubmissionsService {
  async submit(edata: string, headers: ForwardHeaders): Promise<SubmitConsultResponse> {
    const BASE = process.env.PHP_BASE_URL;
    const APP_TOKEN = process.env.PHP_APP_ACCESS_TOKEN;

    if (!BASE || !APP_TOKEN) {
      throw new InternalServerErrorException('Server configuration missing');
    }

    try {
      const response: AxiosResponse<SubmitConsultResponse> = await axios.post(
        `${BASE}/api/app/v2/consult/submissions`,
        { edata },
        {
          headers: {
            Accept: 'application/json',
            'user-access-token': headers.userAccessToken,
            'app-access-token': APP_TOKEN,
            region: headers.region,
          },
          timeout: 20_000,
        },
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>;

        throw new InternalServerErrorException(
          axiosError.response?.data ?? 'Failed to submit consult',
        );
      }

      throw new InternalServerErrorException('Failed to submit consult');
    }
  }
}
