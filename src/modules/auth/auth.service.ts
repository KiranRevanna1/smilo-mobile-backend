import { Injectable } from '@nestjs/common';
import axios, { type AxiosResponse } from 'axios';
import qs from 'qs';
import { LoginDto, ForgotPasswordDto } from './auth.dto';
import type { LoginResponse, ForgotPasswordResponse } from './auth.types';

@Injectable()
export class AuthService {
  async login(body: LoginDto): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await axios.post(
      `${process.env.PHP_BASE_URL}/api/app/v2/user/login`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'App-Access-Token': process.env.PHP_APP_ACCESS_TOKEN!,
        },
      },
    );

    return response.data;
  }
}

@Injectable()
export class ForgotPasswordService {
  async forward(body: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const BASE = process.env.PHP_BASE_URL;
    if (!BASE) {
      throw new Error('PHP_BASE_URL not configured');
    }

    const session = await axios.get<string>(`${BASE}/auth/login`, {
      withCredentials: true,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/html',
      },
    });

    const cookies = session.headers['set-cookie']?.join('; ');
    if (!cookies) {
      throw new Error('Failed to obtain session cookies');
    }

    const otTransMatch = cookies.match(/ot_trans_cookie=([^;]+)/);
    if (!otTransMatch) {
      throw new Error('ot_trans_cookie missing');
    }

    const payload = qs.stringify({
      login_type: 'practice',
      forgot_password_email: body.forgot_password_email,
      ot_trans_token: otTransMatch[1],
      chosen_practice_id: '',
    });

    const response: AxiosResponse<ForgotPasswordResponse> = await axios.post(
      `${BASE}/auth/forgot_password`,
      payload,
      {
        withCredentials: true,
        headers: {
          Cookie: cookies,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Accept: 'application/json',
          Origin: BASE,
          Referer: `${BASE}/auth/login`,
          'User-Agent': 'Mozilla/5.0',
        },
      },
    );

    return response.data;
  }
}
