import {
  Box,
  Flex,
  IconButton,
  Input,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import NoChat from "./NoChat";
import { InputGroup } from "@/components/ui/input-group";
import { GoPaperAirplane } from "react-icons/go";
import { ChatSession } from "@/models/ChatSession";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ChatMessage } from "@/models/ChatMessage";
import { toast } from "react-toastify";
import chatMessageApi from "@/api/modules/chatMessage.api";
import { Avatar } from "@/components/ui/avatar";

interface ChatPageProps {
  onNewChat: () => Promise<ChatSession | null | undefined>;
}

const serverProfileImg = "https://i.ibb.co/BCM1qp8/server-profile.jpg";

const ChatPage: React.FC<ChatPageProps> = ({ onNewChat }) => {
  const { sessionId } = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchChatSessions = async () => {
      setLoading(true);

      try {
        if (sessionId) {
          const res = await chatMessageApi.getAll(sessionId);
          if (res.error) {
            toast.error(res.error?.message || "Something went wrong");
          } else if (res.data) {
            setMessages(res.data);
          }
        }
      } catch (error) {
        console.error("Error fetching chat sessions:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const newSocket = io("http://localhost:1337", {
      auth: {
        token: localStorage.getItem("actkn"),
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("join", { sessionId });
    });

    newSocket.on("message", (newMessage: ChatMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (!socket || !message || !sessionId) return;

    // Prepare the message data
    const messageData = {
      text: message,
      sessionId,
    };

    // Send the message to the server
    socket.emit("sendMessage", messageData);

    // Clear the message input
    setMessage("");
  };

  return (
    <Flex h="full">
      {!sessionId && <NoChat onNewChat={onNewChat} />}
      {sessionId && !isLoading && (
        <VStack h="full" w="full">
          <Box h="full" w="full" overflowY="scroll">
            {/* Render messages */}
            {messages.map((msg, index) => (
              <Flex
                alignItems="center"
                w="full"
                justifyContent={msg.senderType === "USER" ? "end" : "start"}
              >
                {msg.senderType === "SERVER" && (
                  <Avatar size="lg" src={serverProfileImg} mx={2} />
                )}
                <Box
                  key={index}
                  p={4}
                  w="80%"
                  bg={
                    msg.senderType === "USER"
                      ? "colorPalette.subtle"
                      : "bg.emphasized"
                  }
                  borderRadius="md"
                  my={2}
                >
                  <Text>{msg.text}</Text>
                </Box>
              </Flex>
            ))}
          </Box>

          <InputGroup
            w="full"
            endElement={
              <IconButton
                m={0}
                variant="subtle"
                size="sm"
                p={0}
                onClick={sendMessage} // Trigger sendMessage on click
              >
                <GoPaperAirplane />
              </IconButton>
            }
          >
            <Input
              placeholder="Write a Message..."
              variant="subtle"
              size="lg"
              p={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)} // Update message state
            />
          </InputGroup>
        </VStack>
      )}
      {sessionId && isLoading && <Spinner />}
    </Flex>
  );
};

export default ChatPage;
