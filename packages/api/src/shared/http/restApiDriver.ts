import request from 'supertest';
import { Server } from 'http';
import { ApiResponse } from '@efuller/shared/src/api';

export class RestApiDriver {
  constructor(private http: Server) {}

  async get(path: string, headers: Record<string, string> = {}) {
    const response =  request(this.http)
      .get(path)
      .set(headers);
    return response;
  }

  async post<ApiRequest extends object, TData>(path: string, data: ApiRequest): Promise<ApiResponse<TData>> {
    try {
      const response =  await request(this.http)
        .post(path)
        .set('Accept', 'application/json')
        .send(data);

      if (!response.ok) {
        if (response.error && response.error.message) {
          throw new Error(response.error.message);
        }
      }

      return response.body;
    } catch (error) {
     return {
        success: false,
        data: undefined,
        error: error as Error,
      };
    }
  }
}