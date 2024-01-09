import { Text } from "@chakra-ui/react";
import React from "react";
import useAuthContext from "../hooks/useAuthContext";

const Message = ({ name, message, userEmail }) => {
  const {
    user: { email },
  } = useAuthContext();

  return (
    <div
      className={`msg w-fit rounded-md p-2 ${
        email === userEmail ? "sent" : "received"
      }`}
    >
      <p className="font-semibold text-xs text-left">~{name}</p>
      <h4 className="text-lg">{message}</h4>
    </div>
  );
};

export default Message;
