import { ApiResponse } from '@efuller/shared/dist/api';

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  public async get<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }

    return response.json();
  }

  public async post<T>(path: string, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${path}: ${response.statusText}`);
    }

    return response.json();
  }
}