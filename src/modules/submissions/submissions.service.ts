import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import type { ForwardHeaders } from './submissions.dto';

@Injectable()
export class SubmissionsService {
  async submit(edata: string, headers: ForwardHeaders) {
    const BASE = process.env.PHP_BASE_URL;
    const APP_TOKEN = process.env.PHP_APP_ACCESS_TOKEN;

    if (!BASE || !APP_TOKEN) {
      throw new InternalServerErrorException('Server configuration missing');
    }

    try {
      const response = await axios.post(
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
    } catch (error: any) {
      throw new InternalServerErrorException('Failed to submit consult');
    }
  }
}
