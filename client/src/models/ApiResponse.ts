export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  status: number;
  name: string;
}
