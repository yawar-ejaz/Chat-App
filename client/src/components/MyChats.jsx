import {
  Avatar,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ACTIONS } from "../contexts/authContext";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import ChatsLoading from "./ChatsLoading";
import GroupModal from "./GroupModal";
import ProfileModal from "./ProfileModal";
import useSocketIo from "../hooks/useSocketIo";

const MyChats = () => {
  const { user, dispatch } = useAuthContext();
  const { setSelectedChatId, selectedChatId } = useChatContext();
  const toast = useToast();
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { updateChats } = useSocketIo();
  updateChats(setChatList);

  const logoutUser = () => {
    setSelectedChatId(null);
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
    <div className="px-2 py-3">
      <div className="mb-5 flex justify-between items-center">
        <div className="flex items-center gap-x-3">
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
        </div>
        <GroupModal setChatList={setChatList} />
      </div>
      <Divider />
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[calc(100dvh-48px)] pb-20">
        {loading && <ChatsLoading />}
        {chatList?.length === 0 && (
          <div className="h-full w-full items-center flex justify-center">
            <h2 className="text-xl font-semibold">No chats found</h2>
          </div>
        )}
        {chatList?.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setSelectedChatId(chat._id)}
            className={`cursor-pointer w-full rounded-lg flex items-center p-2 ${
              selectedChatId === chat._id
                ? "bg-gray-700 text-white"
                : "bg-white hover:bg-gray-300"
            } transition-colors`}
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
