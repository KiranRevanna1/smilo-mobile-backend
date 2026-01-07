import { Controller, Get, Query, Headers, BadRequestException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { ListPatientsQueryDto } from './patients.dto';

interface IncomingHeaders {
  authorization?: string;
  'app-access-token'?: string;
  region?: string;
}

@Controller('consult')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('patients_list')
  async listPatients(@Query() query: ListPatientsQueryDto, @Headers() headers: IncomingHeaders) {
    const bearer = headers.authorization;

    if (!bearer?.startsWith('Bearer ')) {
      throw new BadRequestException('Authorization Bearer token required');
    }

    if (!query.practice_id) {
      throw new BadRequestException('practice_id is required');
    }

    const page = Number(query.offset ?? 1);
    const pageSize = Number(query.limit ?? 10);

    if (Number.isNaN(page) || Number.isNaN(pageSize)) {
      throw new BadRequestException('Invalid pagination values');
    }

    return this.patientsService.listPatients(
      {
        practiceId: query.practice_id,
        order: query.order === 'ASC' ? 'ASC' : 'DESC',
        page,
        pageSize,
      },
      {
        userAccessToken: bearer.replace('Bearer ', ''),
        appAccessToken: headers['app-access-token'] ?? process.env.PHP_APP_ACCESS_TOKEN!,
        region: headers.region ?? 'AUS',
      },
    );
  }
}
