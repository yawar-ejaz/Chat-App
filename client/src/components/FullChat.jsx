import { useToast } from "@chakra-ui/toast";
import { IconButton, Spinner } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import Messages from "./Messages";
import { Avatar } from "@chakra-ui/avatar";
import { Text } from "@chakra-ui/react";
import MembersModal from "./MembersModal";
import { IoArrowBack } from "react-icons/io5";
import useSocketIo from "../hooks/useSocketIo";
import { motion, AnimatePresence } from "framer-motion";

const FullChat = () => {
  const { selectedChatId, setSelectedChatId } = useChatContext();
  const { user } = useAuthContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { updateGroup, joinChat } = useSocketIo();
  joinChat();
  updateGroup(setData);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const fullChat = await axios.get(`/api/chat/${selectedChatId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setData(fullChat?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast({
          status: "error",
          title: "Something went wrong!",
        });
      }
    })();
  }, [selectedChatId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        whileInView={"visible"}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={{
          visible: { opacity: 1, x: 0 },
          hidden: { opacity: 0, x: "100%" },
        }}
        className="relative h-full"
      >
        <MembersModal data={data} setData={setData}>
          <div className="flex items-center px-4 py-3 bg-gray-300 shadow-md z-10 absolute top-0 w-full cursor-pointer">
            <span className="md:hidden mr-5">
              <IconButton
                size={"sm"}
                icon={<IoArrowBack />}
                onClick={() => setSelectedChatId(null)}
              />
            </span>
            <Avatar
              src={data?.picture}
              size="sm"
              name={data?.chatName}
              mr={2}
            />
            <Text fontSize="xl" as={"b"}>
              {data?.chatName}
            </Text>
          </div>
        </MembersModal>
        <Messages msgs={data?.messages} />
      </motion.div>
    </AnimatePresence>
  );
};

export default FullChat;
