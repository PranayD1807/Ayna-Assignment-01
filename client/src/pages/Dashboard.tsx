import Sidebar from "@/components/Sidebar";
import { Box, Flex } from "@chakra-ui/react";
import ChatPage from "./chat/ChatPage";
import chatSessionApi, {
  CreateChatSessionData,
} from "@/api/modules/chatSession.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const createNewChatSessionHandler = async () => {
    const data: CreateChatSessionData = {
      lastMessage: "Start Chatting...",
    };

    try {
      const res = await chatSessionApi.create(data);
      if (res.error) {
        toast.error(res.error?.message || "Something went wrong");
        return null;
      } else if (res.data) {
        toast.success("Chat created, start chatting !!!");
        navigate(`/chat/${res.data.documentId}`);
        return res.data;
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Something went wrong");
      return null;
    }
  };

  return (
    <Flex h="calc(100vh - 80px)" direction="row" alignItems="start" w="100%">
      <Box
        h="100%"
        overflowY="scroll"
        boxShadow="md"
        flex={{ base: "2", lg: "1" }}
        display={{
          base: "none",
          md: "block",
        }}
      >
        <Sidebar onNewChat={createNewChatSessionHandler} />
      </Box>
      <Box flex={4} p={6} h="full">
        <ChatPage onNewChat={createNewChatSessionHandler} />
      </Box>
    </Flex>
  );
};

export default Dashboard;
