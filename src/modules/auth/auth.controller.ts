import { Body, Controller, Post } from '@nestjs/common';
import { AuthService, ForgotPasswordService } from './auth.service';
import { LoginDto, ForgotPasswordDto } from './auth.dto';

@Controller('user')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly forgotPasswordService: ForgotPasswordService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('forgot_password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.forgotPasswordService.forward(body);
  }
}
