import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import ChatsLoading from "./ChatsLoading";
import UserListItem from "./UserListItem";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../contexts/authContext";
import axios from "axios";

import {
  Box,
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
  useToast,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";

const Navbar = () => {
  const toast = useToast();
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [myChats, setMyChats] = useState([]);

  const findUsers = async (search) => {
    try {
      setLoadingUsers(true);
      const result = await axios.get(`/api/user/search?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFoundUsers(result.data);
      setLoadingUsers(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    if (search === "") {
      setFoundUsers([]);
    } else {
      findUsers(search);
    }
  }, [search]);

  const logoutUser = () => {
    dispatch({
      type: ACTIONS.LOGOUT,
    });
    navigate("/home");
  };

  const accessChat = async (secondUser) => {
    try {
      setLoadingChat(true);

      const result = await axios.post(`/api/chat`, secondUser, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(result.data);

      if (!myChats.find((chat) => chat._id === result.data._id)) {
        setMyChats([result.data, ...myChats]);
      }
      setSelectedChat(result.data);

      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
      });
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection="row"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* <Button variant="ghost" onClick={onOpen}>
          <FaSearch />
          <Text display={{ base: "none", md: "flex" }} px={3}>
            Search User
          </Text>
        </Button> */}

        <Text fontSize="2xl" fontFamily="Work sans">
          ChatterBox...
        </Text>

        <Box display="flex" flexDirection="row" alignItems="center" gap="1rem">
          <Menu>
            <MenuButton as={Button}>
              <IoIosNotifications />
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.name} src={user?.picture} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutUser}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="Type here..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              mb="1rem"
            />

            {loadingUsers ? (
              <ChatsLoading />
            ) : (
              foundUsers.map((user) => (
                <UserListItem
                  user={user}
                  handleFunction={() => {
                    accessChat(user);
                  }}
                  key={user._id}
                />
              ))
            )}
          </DrawerBody>

          <DrawerFooter
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="1rem"
          >
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
