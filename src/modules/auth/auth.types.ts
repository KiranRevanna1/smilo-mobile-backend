export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}
