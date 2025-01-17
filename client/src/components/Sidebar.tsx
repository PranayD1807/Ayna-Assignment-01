import chatSessionApi from "@/api/modules/chatSession.api";
import { ChatSession } from "@/models/ChatSession";
import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { addChatSession, setChatSessions } from "@/store/chatSessionSlice";

interface SideBarProps {
  onNewChat: () => Promise<ChatSession | null | undefined>;
}

const Sidebar: React.FC<SideBarProps> = ({ onNewChat }) => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const chats = useSelector(
    (state: RootState) => state.chatSessions.chatSessions
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const addChatAtTop = (newChat: ChatSession) => {
    dispatch(addChatSession(newChat));
  };

  const createNewChatSession = async () => {
    setIsSaving(true);

    try {
      const newChat = await onNewChat();
      if (newChat) {
        addChatAtTop(newChat);
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchChatSessions = async () => {
      setLoading(true);
      try {
        const res = await chatSessionApi.getAll();

        if (res.error) {
          toast.error(res.error?.message || "Something went wrong");
        } else if (res.data) {
          dispatch(setChatSessions(res.data));
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
    // Empty dependency array ensures this runs only once when the component mounts
  }, [dispatch]);

  const onSessionClickHandler = (sessionId: string) => {
    navigate(`/chat/${sessionId}`, { replace: true });
  };

  return (
    <Flex direction="column" position="relative" p="4" pt={8}>
      {/* New Chat Button */}
      <Button
        loadingText="Saving..."
        loading={isSaving}
        onClick={createNewChatSession}
        mb="4"
        variant="solid"
      >
        New Chat
      </Button>
      {loading && (
        <Flex
          h="200px"
          w="full"
          margin="auto"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="md" />
        </Flex>
      )}
      {!loading && (
        <VStack gap={0} h="100%" w="100%" overflow="scroll" scrollbar="hidden">
          {/* Chat Items */}
          {chats.map((chat) => (
            <Button
              key={chat.documentId}
              p="3"
              as={"a"}
              w="100%"
              mb="2"
              bgColor={chat.documentId == sessionId ? "bg.emphasized" : ""}
              borderRadius="md"
              variant="ghost"
              onClick={() => onSessionClickHandler(chat.documentId)}
            >
              <Text>{chat.lastMessage}</Text>
            </Button>
          ))}
        </VStack>
      )}
    </Flex>
  );
};

export default Sidebar;
