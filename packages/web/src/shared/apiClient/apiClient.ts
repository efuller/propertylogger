import { ApiResponse } from '@efuller/shared/dist/api';
import { AuthController } from '../../modules/auth/auth.controller.ts';

interface Options<T = NonNullable<unknown>> {
  headers?: Record<string, string>,
  data?: T
}

export interface ApiClient {
  get<T>(path: string, options: Options): Promise<ApiResponse<T>>;
  post<T>(path: string, options: Options<T>): Promise<ApiResponse<T>>;
}

export class FetchApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly authController: AuthController
  ) {}

  public async get<T>(path: string, options: Options): Promise<ApiResponse<T>> {
    const token = await this.authController.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  public async post<T>(path: string, options: Options<T>): Promise<ApiResponse<T>> {
    const token = await this.authController.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers
      },
      body: JSON.stringify(options.data)
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }

    return response.json();
  }
}

export interface MockApi extends ApiClient {
  setGetResponse<T>(response: ApiResponse<T>): MockApi;
}

export class MockApiClient implements MockApi {
  private getResponse: ApiResponse<unknown> | undefined;

  constructor(
    private readonly baseUrl: string,
    private readonly authController: AuthController
  ) {}

  public setGetResponse<T>(response: ApiResponse<T>) {
    this.getResponse = response;
    return this;
  }

  public setPostResponse<T>(response: ApiResponse<T>) {
    this.getResponse = response;
    return this;
  }

  public async get<T>(path: string, options: Options): Promise<ApiResponse<T>> {
    console.log('get', path, options);
    return this.getResponse as ApiResponse<T>;
  }

  public async post<T>(path: string, options: Options<T>): Promise<ApiResponse<T>> {
    console.log('post', path, options);
    return this.getResponse as ApiResponse<T>;
  }
}