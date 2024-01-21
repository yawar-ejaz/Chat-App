import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/authContext.jsx";
import { ChatContextProvider } from "./contexts/chatContext.jsx";
import { SocketProvider } from "./contexts/socketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider
      toastOptions={{
        defaultOptions: {
          position: "bottom",
          duration: 5000,
          isClosable: true,
        },
      }}
    >
      <AuthContextProvider>
        <ChatContextProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
