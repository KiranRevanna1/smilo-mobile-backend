import { IsString } from 'class-validator';

export class SubmitConsultDto {
  @IsString()
  edata!: string;
}

export interface ForwardHeaders {
  userAccessToken: string;
  region: string;
}
