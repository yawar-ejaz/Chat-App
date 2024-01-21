import { IconButton, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import Message from "./Message";
import AttachmentModal from "./AttachmentModal";
import useSocketIo from "../hooks/useSocketIo";

const Messages = ({ msgs }) => {
  const { user } = useAuthContext();
  const { selectedChatId } = useChatContext();
  const [messages, setMessages] = useState(msgs);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { reset, register, handleSubmit, setFocus } = useForm();
  const scrollRef = useRef(null);
  const { updateMessages } = useSocketIo();
  updateMessages(setMessages);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitHandler = async (data) => {
    if (!data.message) return;
    setLoading(true);
    try {
      const result = await axios.post(`/api/message/${selectedChatId}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages((prev) => [...prev, result.data]);
      setTimeout(() => {
        setFocus("message");
      }, 500);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: error?.response?.data?.message || "Internal Server Error",
        status: "error",
      });
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-col overflow-y-auto h-full mt-[60px] mb-[80px] px-5">
        {messages?.map((message) => (
          <Message
            key={message._id}
            name={message.sender.name}
            message={message.content}
            userEmail={message.sender.email}
            fileUrl={message.fileUrl}
          />
        ))}
        <div ref={scrollRef} />
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="absolute bottom-0 flex items-center gap-x-2 w-full p-4 bg-gray-300"
      >
        <div className="relative flex items-center flex-1">
          <input
            type="text"
            className="py-3 px-4 block w-full bg-white border-gray-200 rounded-lg text-sm outline-none disabled:opacity-50 disabled:pointer-events-none flex-1 pr-12"
            placeholder="Type a message"
            autoComplete="off"
            {...register("message")}
            disabled={loading}
          />
          <AttachmentModal setMessages={setMessages} />
        </div>
        <IconButton
          icon={<IoSend />}
          type="submit"
          isDisabled={loading}
          backgroundColor={"#B2BEB5"}
        />
      </form>
    </div>
  );
};

export default Messages;
