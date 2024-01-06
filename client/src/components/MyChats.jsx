import { VStack, Text } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import React, { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import {
  Box,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import GroupModal from "./GroupModal";

const MyChats = () => {
  const { user } = useAuthContext();
  const toast = useToast();
    const [chatList, setChatList] = useState([]);


    useEffect(() => {
        (async () => {
            try {
              const myChats = await axios.get("/api/chat", {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              });
              setChatList(myChats.data);
            } catch (error) {
              toast({
                title: "Error fetching the chat",
                description: error.response?.data?.message || "Internal server error",
                status: "error",
              });
            }
        })()
    }, [])

  return (
    <>
      <Box
        width="300px"
        color="black"
        padding="4"
        overflowY="auto"
        border="1px solid black"
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize="xl">My Chats</Text>
          <GroupModal />
        </Box>

        <VStack align="start" spacing="2" mt={3}>
          {chatList.map((chat, index) => (
            <Box
              key={index}
              onClick={() => {}}
              cursor="pointer"
              bg="white"
              _hover={{
                background: "#4267B2 ",
                color: "white",
              }}
              w="100%"
              display="flex"
              alignItems="center"
              color="black"
              px={2}
              py={1}
              borderRadius="lg"
            >
              <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={chat.chatName}
                src={chat.picture}
              />
              <Box>
                <p>{chat.chatName}</p>
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </>
  );
};

export default MyChats;
