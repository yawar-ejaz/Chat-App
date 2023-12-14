import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";

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
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
