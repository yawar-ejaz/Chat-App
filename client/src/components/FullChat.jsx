import { useToast } from "@chakra-ui/toast";
import { Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import Messages from "./Messages";
import { Avatar } from "@chakra-ui/avatar";
import { Text } from "@chakra-ui/react";

const FullChat = () => {
  const { selectedChatId } = useChatContext();
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fullChat = await axios.get(`/api/chat/${selectedChatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setData(fullChat?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          status: "error",
          title: "Something went wrong!",
        });
      }
    })();
  }, [selectedChatId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="flex items-center px-4 py-3 bg-gray-300 shadow-md z-10 absolute top-0 w-full">
        <Avatar src={data?.picture} size="sm" name={data?.chatName} mr={2} />
        <Text fontSize="xl" as={"b"}>
          {data?.chatName}
        </Text>
      </div>
      <Messages msgs={data?.messages} />
    </div>
  );
};

export default FullChat;
