import React from "react";
import useChatContext from "../hooks/useChatContext";
import FullChat from "./FullChat";

const ChatWindow = () => {
  const { selectedChatId } = useChatContext();
  return <>{!selectedChatId ? <h1>No chat </h1> : <FullChat/>}</>;
};

export default ChatWindow;
