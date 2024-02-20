import request from 'supertest';
import { Server } from 'http';
import { ApiResponse } from '@efuller/shared/src/api';

export class RestApiDriver {
  constructor(private http: Server) {}

  async get(path: string) {
    const response =  request(this.http).get(path);
    return response;
  }

  async post<T extends object>(path: string, data: T): Promise<ApiResponse<Partial<T>>> {
    const response =  await request(this.http)
      .post(path)
      .set('Accept', 'application/json')
      .send(data);
    return {
      success: true,
      data: response.body,
    };
  }
}