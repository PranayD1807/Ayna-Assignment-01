import { ApiResponse } from "@/models/ApiResponse";
import privateClient from "../client/private.client";
import { ChatMessage } from "@/models/ChatMessage";
import { handleApiError } from "../helper/error.helper";

const chatMessageEndpoints = {
  getAll:
    "messages?filters[session][documentId][$eq]={sessionId}&sort[0]=createdAt:desc",
  get: "messages/{id}",
  create: "messages",
  update: "messages/{id}",
  delete: "messages/{id}",
};

export interface CreateChatMessageData {
  text: string;
  senderType: string;
  session: string;
  user: string;
}

const chatMessageApi = {
  getAll: async (sessionId: string): Promise<ApiResponse<ChatMessage[]>> => {
    try {
      const endpoint = chatMessageEndpoints.getAll.replace(
        "{sessionId}",
        sessionId
      );

      const response = await privateClient.get<ApiResponse<ChatMessage[]>>(
        endpoint
      );

      return {
        data: response.data.data || [],
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },

  get: async (id: string): Promise<ApiResponse<ChatMessage | null>> => {
    try {
      const endpoint = chatMessageEndpoints.get.replace("{id}", id);
      const response = await privateClient.get<ApiResponse<ChatMessage>>(
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
    contactData: CreateChatMessageData
  ): Promise<ApiResponse<ChatMessage | null>> => {
    try {
      const response = await privateClient.post<ApiResponse<ChatMessage>>(
        chatMessageEndpoints.create,
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
    contactData: CreateChatMessageData
  ): Promise<ApiResponse<ChatMessage | null>> => {
    try {
      const endpoint = chatMessageEndpoints.update.replace("{id}", id);
      const response = await privateClient.patch<ApiResponse<ChatMessage>>(
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
      const endpoint = chatMessageEndpoints.delete.replace("{id}", id);
      await privateClient.delete<ApiResponse<null>>(endpoint);

      return {
        data: null,
      };
    } catch (err: unknown) {
      return handleApiError(err);
    }
  },
};

export default chatMessageApi;
