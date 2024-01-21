import React, { useState } from "react";

const ChatContext = React.createContext({
  selectedChatId: null,
  setSelectedChatId: () => {},
});

const ChatContextProvider = ({ children }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  return (
    <ChatContext.Provider value={{ selectedChatId, setSelectedChatId }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContextProvider, ChatContext };
