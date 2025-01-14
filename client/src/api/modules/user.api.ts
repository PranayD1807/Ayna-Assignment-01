// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AxiosError } from "axios";
import privateClient from "../client/private.client";
import publicClient from "../client/public.client";
import { handleApiError } from "../helper/error.helper";
import { ApiError, ApiResponse } from "@/models/ApiResponse";

const userEndpoints = {
  signin: "auth/local/",
  signup: "auth/local/register",
  getInfo: "users/me",
  passwordUpdate: "auth/update-password",
};

interface SigninData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  username: string;
}

interface PasswordUpdateData {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface UserInfo {
  documentId: string;
  email: string;
  username: string;
}

interface SigninResponse {
  jwt: string;
  user: UserInfo;
  error: ApiError;
}

interface SignupResponse {
  jwt: string;
  user: UserInfo;
  error: ApiError;
}

interface PasswordUpdateResponse {
  message: string;
  error: ApiError;
  status: string;
}

interface GetInfoResponse {
  status: string;
  error: ApiError;
  data: UserInfo;
}

const userApi = {
  signin: async ({
    email,
    password,
  }: SigninData): Promise<ApiResponse<SigninResponse>> => {
    try {
      const response = await publicClient.post<SigninResponse>(
        userEndpoints.signin,
        { identifier: email, password }
      );

      return {
        data: response.data,
      };
    } catch (err: unknown) {
      return handleApiError<SigninResponse>(err);
    }
  },

  signup: async ({
    email,
    password,
    username,
  }: SignupData): Promise<ApiResponse<SignupResponse>> => {
    try {
      const response = await publicClient.post<SignupResponse>(
        userEndpoints.signup,
        {
          email,
          password,
          username,
        }
      );

      return {
        error: response.data.error,
        data: response.data,
      };
    } catch (err: AxiosError | unknown) {
      return handleApiError<SignupResponse>(err);
    }
  },

  getInfo: async (): Promise<ApiResponse<GetInfoResponse>> => {
    try {
      const response = await privateClient.get<GetInfoResponse>(
        userEndpoints.getInfo
      );

      return {
        data: response.data,
        error: response.data.error,
      };
    } catch (err: unknown) {
      return handleApiError<GetInfoResponse>(err);
    }
  },

  passwordUpdate: async ({
    password,
    newPassword,
    confirmNewPassword,
  }: PasswordUpdateData): Promise<ApiResponse<PasswordUpdateResponse>> => {
    try {
      const response = await privateClient.put<PasswordUpdateResponse>(
        userEndpoints.passwordUpdate,
        {
          password,
          newPassword,
          confirmNewPassword,
        }
      );

      return {
        data: response.data,
        error: response.data.error,
      };
    } catch (err: unknown) {
      return handleApiError<PasswordUpdateResponse>(err);
    }
  },
};

export default userApi;
