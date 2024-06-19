import { ApiResponse } from '@efuller/shared/dist/api';
import { AuthController } from '../../modules/auth/auth.controller.ts';
import { MockApi, Options } from './apiClient.ts';

export class MockApiClient implements MockApi {
  private getResponse: ApiResponse<unknown> | undefined;
  private postResponse: ApiResponse<unknown> | undefined;

  constructor(
    private readonly baseUrl: string,
    private readonly authController: AuthController
  ) {}

  public setGetResponse<T>(response: ApiResponse<T>) {
    this.getResponse = response;
    return this;
  }

  public setPostResponse<T>(response: ApiResponse<T>) {
    this.postResponse = response;
    return this;
  }

  public async get<T>(path: string, options: Options): Promise<ApiResponse<T>> {
    console.log('get', path, options);
    return this.getResponse as ApiResponse<T>;
  }

  public async post<T>(path: string, options: Options<T>): Promise<ApiResponse<T>> {
    console.log('post', path, options, this.postResponse);
    return this.postResponse as ApiResponse<T>;
  }
}
