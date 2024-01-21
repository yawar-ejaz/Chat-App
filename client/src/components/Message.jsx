import { Text } from "@chakra-ui/react";
import React from "react";
import useAuthContext from "../hooks/useAuthContext";
import { FaFile } from "react-icons/fa6";

const Message = ({ name, message, userEmail, fileUrl }) => {
  const {
    user: { email },
  } = useAuthContext();

  const fileDownloader = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = message;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  if (fileUrl) {
    return (
      <div
        className={`msg w-fit rounded-md cursor-pointer px-2 py-1 ${
          userEmail === email ? "sent" : "received"
        }`}
        onClick={fileDownloader}
      >
        <p className="font-bold text-xs text-left">{name}</p>
        <FaFile className="h-5 w-5 mx-auto text-black mt-3" />
        <p className="text-md">{message}</p>
      </div>
    );
  } else {
    return (
      <div
        className={`msg w-fit rounded-md px-2 py-1 ${
          userEmail === email ? "sent" : "received"
        }`}
      >
        <p className="font-bold text-xs text-left">{name}</p>
        <p className="text-md">{message}</p>
      </div>
    );
  }
};

export default Message;
