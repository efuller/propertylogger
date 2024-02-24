export type ApiResponse<T> = {
  success: boolean;
  error?: Error | false;
  data: T;
}