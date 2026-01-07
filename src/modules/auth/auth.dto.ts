import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  edata!: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  forgot_password_email!: string;
}
