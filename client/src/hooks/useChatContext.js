import { useContext } from "react";
import { ChatContext } from "../contexts/chatContext";

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chat context must be used inside chatContext Provider!");
  }
  return context;
};

export default useChatContext;
