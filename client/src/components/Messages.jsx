import { FormControl } from "@chakra-ui/form-control";
import {
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import Message from "./Message";

const Messages = ({ msgs }) => {
  const { user } = useAuthContext();
  const { selectedChatId } = useChatContext();
  const [messages, setMessages] = useState(msgs);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { reset, register, handleSubmit } = useForm();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post(`/api/message/${selectedChatId}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setMessages((prev) => [...prev, result.data]);
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
      <div className="flex-col overflow-y-auto h-full mt-[60px] mb-[100px] px-5">
        {messages?.map((message) => (
          <Message
            key={message._id}
            name={message.sender.name}
            message={message.content}
            userEmail={message.sender.email}
          />
        ))}
        <div ref={scrollRef} />
      </div>
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="absolute block bottom-0 w-full p-4 bg-gray-400"
      >
        <FormControl isRequired isDisabled={loading}>
          <InputGroup size="md">
            <Input
              type="text"
              autoComplete="off"
              {...register("message")}
              backgroundColor={"white"}
              outline={"none"}
            />
            <InputRightElement h={"full"}>
              <IconButton icon={<IoSend />} type="submit" />
            </InputRightElement>
          </InputGroup>
        </FormControl>
      </form>
    </div>
  );
};

export default Messages;
