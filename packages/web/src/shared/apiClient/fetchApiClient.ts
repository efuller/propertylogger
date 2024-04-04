import { AuthController } from '../../modules/auth/auth.controller.ts';
import { ApiResponse } from '@efuller/shared/dist/api';
import { Options } from './apiClient.ts';

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
