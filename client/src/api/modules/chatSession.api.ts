import { ApiResponse } from "@/models/ApiResponse";
import privateClient from "../client/private.client";
import { ChatSession } from "@/models/ChatSession";
import { handleApiError } from "../helper/error.helper";

const chatSessionEndpoints = {
  getAll: "sessions?sort[0]=createdAt:desc",
  get: "sessions/{id}",
  create: "sessions",
  update: "sessions/{id}",
  delete: "sessions/{id}",
};

export interface CreateChatSessionData {
  lastMessage: string;
  user?: string;
}

const chatSessionApi = {
  getAll: async (): Promise<ApiResponse<ChatSession[]>> => {
    try {
      const endpoint = chatSessionEndpoints.getAll;
      const response = await privateClient.get<ApiResponse<ChatSession[]>>(
        endpoint
      );

      return {
        data: response.data.data || [],
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },

  get: async (id: string): Promise<ApiResponse<ChatSession | null>> => {
    try {
      const endpoint = chatSessionEndpoints.get.replace("{id}", id);
      const response = await privateClient.get<ApiResponse<ChatSession>>(
        endpoint
      );

      return {
        data: response.data.data || null,
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },

  create: async (
    contactData: CreateChatSessionData
  ): Promise<ApiResponse<ChatSession | null>> => {
    try {
      const response = await privateClient.post<ApiResponse<ChatSession>>(
        chatSessionEndpoints.create,
        { data: contactData }
      );

      return {
        data: response.data.data || null,
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },

  update: async (
    id: string,
    contactData: CreateChatSessionData
  ): Promise<ApiResponse<ChatSession | null>> => {
    try {
      const endpoint = chatSessionEndpoints.update.replace("{id}", id);
      const response = await privateClient.patch<ApiResponse<ChatSession>>(
        endpoint,
        {
          data: contactData,
        }
      );

      return {
        data: response.data.data || null,
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const endpoint = chatSessionEndpoints.delete.replace("{id}", id);
      await privateClient.delete<ApiResponse<null>>(endpoint);

      return {
        data: null,
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },
};

export default chatSessionApi;
