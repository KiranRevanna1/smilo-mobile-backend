import { IsString } from 'class-validator';

export class UploadImageBodyDto {
  @IsString()
  image_path!: string;
}

export interface ForwardHeaders {
  userAccessToken: string;
  region: string;
}
