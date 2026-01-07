import axios from 'axios';
import { Injectable, BadGatewayException } from '@nestjs/common';
import { ForwardHeaders, ListPatientsPayload } from './patients.dto';

@Injectable()
export class PatientsService {
  async listPatients(payload: ListPatientsPayload, headers: ForwardHeaders): Promise<unknown> {
    const offset = (payload.page - 1) * payload.pageSize;

    const params = {
      practice_id: payload.practiceId,
      order: payload.order,
      offset,
      limit: payload.pageSize,
    };

    try {
      const response = await axios.get(
        `${process.env.PHP_BASE_URL}/api/app/v2/consult/patients_list`,
        {
          params,
          headers: {
            'User-Access-Token': headers.userAccessToken,
            'App-Access-Token': headers.appAccessToken,
            region: headers.region,
          },
          timeout: 8000,
        },
      );

      return response.data;
    } catch (err: any) {
      throw new BadGatewayException(err?.response?.data ?? 'Failed to fetch patients list');
    }
  }
}
