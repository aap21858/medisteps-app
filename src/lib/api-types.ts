export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    validationErrors?: string[];
  };
  status: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export const isApiErrorResponse = (response: any): response is ApiErrorResponse => {
  return response.error !== undefined;
};