import { ChatSession } from "@/models/ChatSession";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatSessionsState {
  chatSessions: ChatSession[];
}

const initialState: ChatSessionsState = {
  chatSessions: [],
};

const chatSessionSlice = createSlice({
  name: "chatSessions",
  initialState,
  reducers: {
    setChatSessions(state, action: PayloadAction<ChatSession[]>) {
      state.chatSessions = action.payload;
    },
    addChatSession(state, action: PayloadAction<ChatSession>) {
      state.chatSessions.unshift(action.payload);
    },
    updateChatSession(state, action: PayloadAction<ChatSession>) {
      const index = state.chatSessions.findIndex(
        (chat) => chat.documentId === action.payload.documentId
      );
      if (index !== -1) {
        state.chatSessions[index] = action.payload;
      }
    },
    removeChatSession(state, action: PayloadAction<string>) {
      state.chatSessions = state.chatSessions.filter(
        (chat) => chat.documentId !== action.payload
      );
    },
    clearChatSessions(state) {
      state.chatSessions = [];
    },
  },
});

export const {
  setChatSessions,
  addChatSession,
  updateChatSession,
  removeChatSession,
  clearChatSessions,
} = chatSessionSlice.actions;

export default chatSessionSlice.reducer;
