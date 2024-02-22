import { ApiResponse } from '@efuller/shared/dist/api';

interface Options<T = NonNullable<unknown>> {
  headers: {
    Authorization: string;
  },
  data?: T
}

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  public async get<T>(path: string, options: Options): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  public async post<T>(path: string, options: Options<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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