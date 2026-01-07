import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envConfig from './config/env.config';

import { AuthModule } from './modules/auth/auth.module';
import { UploadImageModule } from './modules/uploadImage/uploadImage.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { PatientsModule } from './modules/patients/patients.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    AuthModule,
    PatientsModule,
    UploadImageModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
