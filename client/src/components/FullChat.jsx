import React, { useEffect } from "react";
import useChatContext from "../hooks/useChatContext";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

const FullChat = () => {
  const { selectedChatId } = useChatContext();
  const { user } = useAuthContext();

  useEffect(() => {
    (async () => {
      try {
        const fullChat = await axios.get(`/api/message/${selectedChatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log(fullChat.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedChatId]);

  return <div>{selectedChatId}</div>;
};

export default FullChat;
