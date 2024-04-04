import { ApiResponse } from '@efuller/shared/dist/api';

export interface Options<T = NonNullable<unknown>> {
  headers?: Record<string, string>,
  data?: T
}

export interface ApiClient {
  get<T>(path: string, options: Options): Promise<ApiResponse<T>>;
  post<T>(path: string, options: Options<T>): Promise<ApiResponse<T>>;
}

export interface MockApi extends ApiClient {
  setGetResponse<T>(response: ApiResponse<T>): MockApi;
}
