import { Button } from "@/components/ui/button";
import { ChatSession } from "@/models/ChatSession";
import { addChatSession } from "@/store/chatSessionSlice";
import { AppDispatch } from "@/store/store";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";

interface NoChatProps {
  onNewChat: () => Promise<ChatSession | null | undefined>;
}

const NoChat: React.FC<NoChatProps> = ({ onNewChat }) => {
  const infoImgUrl =
    "https://i.ibb.co/GkFtV3n/vecteezy-a-laptop-with-two-speech-bubbles-and-a-chat-bubble-51683920.png";

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

  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      h="80vh"
      w="full"
      gap={4}
    >
      <Image src={infoImgUrl} h="200px" />
      <Text
        fontSize="xl"
        textWrap="pretty"
        w={{ md: "30vw", base: "80vw" }}
        textAlign="center"
      >
        Click "New Chat" to start a conversation or choose a previous chat from
        the sidebar.
      </Text>
      <Button
        onClick={createNewChatSession}
        loading={isSaving}
        loadingText="Saving..."
        variant="solid"
      >
        New Chat
      </Button>
    </Flex>
  );
};

export default NoChat;
