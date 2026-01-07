import { Controller, Post, Headers, Body, BadRequestException } from '@nestjs/common';
import type { IncomingHttpHeaders } from 'http';
import { SubmissionsService } from './submissions.service';
import { SubmitConsultDto } from './submissions.dto';
import type { SubmitConsultResponse } from './submissions.types';

@Controller('consult')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('submissions')
  async submit(
    @Body() body: SubmitConsultDto,
    @Headers() headers: IncomingHttpHeaders,
  ): Promise<SubmitConsultResponse> {
    const bearer = headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization Bearer token required');
    }

    const region = typeof headers['x-region'] === 'string' ? headers['x-region'] : 'AUS';

    return this.submissionsService.submit(body.edata, {
      userAccessToken: bearer.replace('Bearer ', ''),
      region,
    });
  }
}
