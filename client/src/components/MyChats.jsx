import { VStack, Text, Divider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ChatsLoading from "./ChatsLoading";
import UserListItem from "./UserListItem";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import {
  Box,
  Button,
  Tooltip,
  Menu,
  Input,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
  useDisclosure,
  AvatarBadge,
  AvatarGroup,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
} from "@chakra-ui/react";
import GroupModal from "./GroupModal";

const MyChats = () => {
  const { user } = useAuthContext();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);
  const [search, setSearch] = useState("");

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
        description: error.message,
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

  // Sample data, replace this with your actual chat data
  const chatList = [
    "Friend 1",
    "Friend 2",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    "Group Chat 1",
    // Add more chat names as needed
  ];

  return (
    <>
      <Box
        width="300px"
        color="black"
        padding="4"
        overflowY="auto"
        border="2px solid black"
      >
        <Button variant="ghost" onClick={onOpen} mr={2}>
          <FaSearch />
          <Text display={{ base: "none", md: "flex" }} px={3}>
            Search User
          </Text>
        </Button>
        <GroupModal />
        <VStack align="start" spacing="2" mt={3}>
          {chatList.map((chatName, index) => (
            <Box key={index} width="100%" cursor="pointer">
              <Text fontWeight="bold">{chatName}</Text>
              <Divider />
            </Box>
          ))}
        </VStack>
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

export default MyChats;
