import { AxiosError } from "axios";
import { ApiResponse, ApiError } from "@/models/ApiResponse";

export const handleApiError = <T>(error: unknown): ApiResponse<T> => {
  console.log("handleApiError captured a error: ", error);

  const defaultError: ApiError = {
    message: "An unexpected error occurred.",
    name: "UnknownError",
    status: 500,
  };

  if (error instanceof AxiosError && error.response?.data?.error) {
    const errorObj = error.response.data.error;

    return {
      data: null as unknown as T, // Ensures proper typing for data as null
      error: {
        message: errorObj.message || defaultError.message,
        name: errorObj.name || defaultError.name,
        status: errorObj.status || defaultError.status,
      },
    };
  }

  return {
    data: null as unknown as T,
    error: defaultError,
  };
};
