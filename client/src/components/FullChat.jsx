import React, { useEffect, useState } from "react";
import useChatContext from "../hooks/useChatContext";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import Messages from "./Messages";

import { Box, VStack, Text, Flex } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";

const FullChat = () => {
  const { selectedChatId } = useChatContext();
  const { user } = useAuthContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const fullChat = await axios.get(`/api/chat/${selectedChatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log(fullChat.data);
        setData(fullChat?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedChatId]);

  return (
    <Flex direction={"column"} width="100%" >
      {/* <Box width={"full"}> */}
        <Box
          display={"flex"}
          alignItems={"center"}
          px={4}
          py={3}
          bg={"gray.200"}
          shadow={"md"}
        >
          <Avatar src={data.picture} size="sm" name={data.chatName} mr={2} />
          <Text fontSize="xl" as={"b"}>
            {data.chatName}
          </Text>
        </Box>
      {/* </Box> */}
      <Messages msgs={data.messages} />
    </Flex>
  );
};

export default FullChat;
