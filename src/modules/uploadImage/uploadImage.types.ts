export interface UploadImageResponse {
  success: boolean;
  message?: string;
  image_url?: string;
  [key: string]: unknown;
}
