import { Box, Flex, IconButton, Input, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import NoChat from "./NoChat";
import { InputGroup } from "@/components/ui/input-group";
import { GoPaperAirplane } from "react-icons/go";
import { ChatSession } from "@/models/ChatSession";

interface ChatPageProps {
  onNewChat: () => Promise<ChatSession | null | undefined>;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNewChat }) => {
  const { sessionId } = useParams();
  return (
    <Flex h="full">
      {!sessionId && <NoChat onNewChat={onNewChat} />}
      {sessionId && (
        <VStack h="full" w="full">
          <Box h="full" w="full" bg="beige">
            THIS WILL BE CHATS
          </Box>
          <InputGroup
            w="full"
            endElement={
              <IconButton m={0} variant="subtle" size="sm" p={0}>
                <GoPaperAirplane />
              </IconButton>
            }
          >
            <Input
              placeholder="Write a Message..."
              variant="subtle"
              size="lg"
              p={4}
            />
          </InputGroup>
        </VStack>
      )}
    </Flex>
  );
};

export default ChatPage;
