import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService, ForgotPasswordService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ForgotPasswordService],
})
export class AuthModule {}
