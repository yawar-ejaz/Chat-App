import React from "react";
import useChatContext from "../hooks/useChatContext";
import FullChat from "./FullChat";

const ChatWindow = () => {
  const { selectedChatId } = useChatContext();
  return (
    <>
      {!selectedChatId ? (
        <div className="flex flex-col bg-gray-100 items-center justify-center h-full w-full">
            <h2 className="text-3xl font-semibold">
              Click a chat to start conversation
            </h2>
        </div>
      ) : (
        <FullChat />
      )}
    </>
  );
};

export default ChatWindow;
