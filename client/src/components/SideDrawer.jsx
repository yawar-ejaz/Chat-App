import React, { useEffect, useState } from "react";
import ProfileModal from "./ProfileModal";
import { FaSearch } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
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
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundUsers, setFoundUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  // console.log(user.token);

  const findUsers = async (search) => {
    const result = await axios.get(`/api/user/search?search=${search}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setFoundUsers(result.data);
  };

  useEffect(() => {
    if (search === "") {
      setFoundUsers([]);
    } else {
      findUsers(search);
    }
  }, [search]);

  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    navigate("/home");
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
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <FaSearch />
            <Text display={{ base: "none", md: "flex" }} px={3}>
              Search User
            </Text>
          </Button>
        </Tooltip>

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
              <Avatar size="sm" name="Dan Abrahmov" />
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
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="Type here..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Table size="sm" mt="10px">
              <Tbody >
                {foundUsers.map((user) => (
                  <Tr key={user._id}>
                    <Td>{user.name}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
            <Button colorScheme="facebook">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
