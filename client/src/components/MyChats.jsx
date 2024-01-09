import {
  Box,
  useToast,
  Divider,
  Button,
  Menu,
  Input,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
import { ACTIONS } from "../contexts/authContext";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import React, { useEffect, useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import GroupModal from "./GroupModal";
import ChatsLoading from "./ChatsLoading";

const MyChats = () => {
  const { user, dispatch } = useAuthContext();
  const { setSelectedChatId, selectedChatId } = useChatContext();
  const toast = useToast();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);

  const logoutUser = () => {
    dispatch({
      type: ACTIONS.LOGOUT,
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const myChats = await axios.get("/api/chat", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setChatList(myChats.data);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error fetching chats!",
          description: error.response?.data?.message || "Internal server error",
          status: "error",
        });
      }
    })();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-5 flex  justify-between items-center">
        <Menu>
          <MenuButton>
            <Avatar size="md" name={user?.name} src={user?.picture} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </MenuList>
        </Menu>
        <h2 className="font-bold text-xl">Chats</h2>
        <GroupModal />
      </div>
      <Divider />
      <div className="flex flex-col gap-y-2 overflow-y-auto">
        {loading && <ChatsLoading />}
        {chatList?.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChatId(chat._id)}
            className={`cursor-pointer w-full rounded-lg flex items-center p-2 ${
              selectedChatId === chat._id ? "bg-gray-700 text-white hover:bg-gray-700" : "bg-white"
            } hover:bg-gray-300 transition-colors`}
          >
            <Avatar
              mr={2}
              size="sm"
              cursor="pointer"
              name={chat.chatName}
              src={chat.picture}
            />
            <p>{chat.chatName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyChats;

{/* <Box
  key={chat._id}
  onClick={() => setSelectedChatId(chat._id)}
  cursor="pointer"
  bg={selectedChatId === chat._id ? "lightgreen" : "white"}
  _hover={{
    background: "#4267B2 ",
    color: "white",
  }}
  w="100%"
  display="flex"
  alignItems="center"
  color="black"
  px={2}
  py={1}
  borderRadius="lg"
>
  <Avatar
    mr={2}
    size="sm"
    cursor="pointer"
    name={chat.chatName}
    src={chat.picture}
  />
  <Box>
    <p>{chat.chatName}</p>
  </Box>
</Box>; */}