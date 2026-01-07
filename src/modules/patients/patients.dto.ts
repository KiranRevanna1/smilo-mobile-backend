export class ListPatientsQueryDto {
  practice_id!: string;
  order?: 'ASC' | 'DESC';
  offset?: string;
  limit?: string;
}

export interface ListPatientsPayload {
  practiceId: string;
  order: 'ASC' | 'DESC';
  page: number;
  pageSize: number;
}

export interface ForwardHeaders {
  userAccessToken: string;
  appAccessToken: string;
  region: string;
}
