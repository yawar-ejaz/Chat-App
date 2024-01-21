import { useToast } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import useAuthContext from "./useAuthContext";
import useChatContext from "./useChatContext";
import useSocketContext from "./useSocketContext";

const useSocketIo = () => {
  const { selectedChatId, setSelectedChatId } = useChatContext();
  const {
    user: { _id },
  } = useAuthContext();
  const { socket } = useSocketContext();
  const toast = useToast();

  const joinChat = useCallback(() => {
    useEffect(() => {
      if (!selectedChatId) return;
      socket.emit("join-chat", selectedChatId);

      return () => {
        socket.emit("leave-chat", selectedChatId);
      };
    }, [selectedChatId]);
  }, [socket, _id]);

  const updateMessages = useCallback(
    (setMessages) => {
      const handleNewMessage = (message) => {
        if (message.senderId === _id) return;
        setMessages((prev) => [...prev, message]);
      };

      useEffect(() => {
        socket.on("new-message", handleNewMessage);

        return () => {
          socket.off("new-message", handleNewMessage);
        };
      }, []);
    },
    [socket, _id]
  );

  const updateChats = useCallback(
    (setChatList) => {
      const handleNewChat = (chat) => {
        if (chat.groupAdminId === _id) return;
        setChatList((prev) => [chat, ...prev]);
        toast({
          status: "info",
          title: `You were added in ${chat.chatName}`,
        });
      };

      const handleRemoveChat = (removedChat) => {
        setSelectedChatId((prevChatId) => {
          if (prevChatId === removedChat._id) {
            return null;
          }
          return prevChatId;
        });

        setChatList((chatLists) =>
          chatLists.filter((chat) => chat._id !== removedChat._id)
        );

        toast({
          status: "error",
          title: `You were removed from ${removedChat.chatName}`,
        });
      };

      useEffect(() => {
        socket.on(`new-chat-${_id}`, handleNewChat);
        socket.on(`chat-remove-${_id}`, handleRemoveChat);

        return () => {
          socket.off(`new-chat-${_id}`, handleNewChat);
          socket.off(`chat-remove-${_id}`, handleRemoveChat);
        };
      }, [socket, _id]);
    },
    [socket, _id]
  );

  const updateGroup = useCallback(
    (setData) => {
      const handleGroupUpdate = (data) => {
        if (data.groupAdminId === _id) return;
        setData(data);
      };

      useEffect(() => {
        socket.on("update-group", handleGroupUpdate);

        return () => {
          socket.off("update-group", handleGroupUpdate);
        };
      }, []);
    },
    [socket, _id]
  );

  return { updateMessages, updateChats, joinChat, updateGroup };
};

export default useSocketIo;
