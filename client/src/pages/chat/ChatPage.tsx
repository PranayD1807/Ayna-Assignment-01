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

    const newSocket = io("https://playful-happiness-672a03754c.strapiapp.com/", {
      auth: {
        token: localStorage.getItem("actkn"),
      },
      query: { debug: true },
    });

    newSocket.on("connect", () => {
      console.log("Joining room: ", sessionId);
      newSocket.emit("join", { sessionId });
    });

    newSocket.on("receive_message", (newMessage: ChatMessage) => {
      console.log("Received message:", newMessage);
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
    });

    setSocket(newSocket);
  }, [sessionId]);

  const sendMessage = () => {
    if (!socket || !message || !sessionId) return;

    const messageData = {
      text: message,
      sessionId,
    };

    socket.emit("sendMessage", messageData);

    setMessage("");
  };

  return (
    <Flex h="full">
      {!sessionId && <NoChat onNewChat={onNewChat} />}
      {sessionId && !isLoading && (
        <VStack h="full" w="full">
          <Flex h="full" w="full" overflowY="scroll" direction="column-reverse">
            {/* Render messages */}
            {messages.map((msg, index) => (
              <Flex
                alignItems="center"
                w="full"
                justifyContent={msg.senderType === "USER" ? "end" : "start"}
                key={index}
              >
                {msg.senderType === "SERVER" && (
                  <Avatar size="lg" src={serverProfileImg} mx={2} />
                )}
                <VStack
                  alignItems={msg.senderType === "USER" ? "end" : "start"}
                >
                  <Box
                    px={8}
                    py={3}
                    bg={
                      msg.senderType === "USER"
                        ? "colorPalette.subtle"
                        : "bg.emphasized"
                    }
                    borderRadius="2xl"
                    mt={2}
                  >
                    <Text>{msg.text}</Text>
                  </Box>
                  <Text mx={2} fontSize="xs">
                    {new Date(msg.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </Text>
                </VStack>
              </Flex>
            ))}
          </Flex>

          <InputGroup
            w="full"
            endElement={
              <IconButton
                m={0}
                variant="subtle"
                size="sm"
                p={0}
                onClick={sendMessage}
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
      {sessionId && isLoading && (
        <Flex justifyContent="center" alignItems="center" w="full" h="full">
          <Spinner size="xl" />
        </Flex>
      )}
    </Flex>
  );
};

export default ChatPage;
