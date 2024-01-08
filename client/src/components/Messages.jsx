import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import useChatContext from "../hooks/useChatContext";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

const Messages = ({ msgs }) => {
  const { user } = useAuthContext();
  const [messages, setMessages] = useState(null);
  const { setSelectedChatId, selectedChatId } = useChatContext();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { reset, register, handleSubmit } = useForm();

  useEffect(() => {
    setMessages(msgs);
  }, [msgs]);

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post(`/api/message/${selectedChatId}`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);
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
    <Box display={"flex"} flex={1} flexDirection={"column"}>
      <Box
        flex={1}
              display={"flex"}
              flexDirection={"column"}
        overflowY={"auto"}
        border={"2px solid black"}
      >
        {messages?.map((message) => (
          <Message
            key={message._id}
            name={message.sender.name}
            message={message.content}
          />
        ))}
      </Box>
      <form
        onSubmit={handleSubmit(submitHandler)}
        style={{ padding: "1rem", width: "full", backgroundColor: "gray" }}
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
    </Box>
  );
};

export default Messages;
