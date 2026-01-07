import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  const server = app.getHttpAdapter().getInstance() as Express;
  server.set('trust proxy', 1);

  app.use((req: Request, res: Response, next: NextFunction): void => {
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'x-region',
      'app-access-token',
      'x-practitioner-token',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.enableShutdownHooks();

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to bootstrap NestJS application', error);
  process.exit(1);
});
