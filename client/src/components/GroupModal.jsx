import { Avatar } from "@chakra-ui/avatar";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  TagCloseButton,
  TagLabel,
  VStack,
  useDisclosure,
  useToast,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuthContext from "../hooks/useAuthContext";
import UserListItem from "./UserListItem";

const GroupModal = ({ setChatList }) => {
  const toast = useToast();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { reset, register, handleSubmit } = useForm();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const findUsers = async (search) => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/user/search?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFoundUsers(result.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Internal server error",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === "") {
      setFoundUsers([]);
    } else {
      findUsers(search);
    }
  }, [search]);

  const appendUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearch("");
  };
  const removeUser = (userToRemove) => {
    const updatedUsers = selectedUsers.filter((user) => user !== userToRemove);
    setSelectedUsers(updatedUsers);
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const users = selectedUsers.map((user) => user._id);
    try {
      const formData = new FormData();
      formData.append("groupName", data.groupName);
      formData.append("users", users);
      if (data.groupPic) {
        formData.append("pic", data.groupPic[0]);
      }

      const result = await axios.post("/api/chat/group", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast({
        status: "success",
        title: "Group created successfully!",
      });
      setChatList((prev) => [result.data?.group, ...prev]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Internal server error",
        status: "error",
      });
      console.log(error);
    } finally {
      reset();
      setSelectedUsers([]);
      onClose();
      setLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="green" size="sm" variant="solid" onClick={onOpen}>
        + Group
      </Button>
      <Modal size="lg" onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Work sans" textAlign={"center"}>
            Create Group
          </ModalHeader>
          <Divider />
          <ModalBody py={4}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <VStack spacing="10px">
                <FormControl isRequired>
                  <Input
                    placeholder="Group Name"
                    type="text"
                    autoComplete="off"
                    {...register("groupName")}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Group picture</FormLabel>
                  <Input
                    placeholder="Group Name"
                    type="file"
                    p={1.5}
                    accept="image/*"
                    {...register(`groupPic`)}
                  />
                </FormControl>
                <Box position="relative" width="100%">
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                  {search && foundUsers.length > 0 && (
                    <Box
                      width="100%"
                      maxH={"200px"}
                      color="black"
                      padding="4"
                      overflowY="auto"
                      rounded={"md"}
                      boxShadow={"lg"}
                      position="absolute"
                      top="42px"
                      backgroundColor="white"
                      zIndex={1}
                    >
                      {!loading &&
                        foundUsers.map((user) => (
                          <UserListItem
                            member={user}
                            handleFunction={() => {
                              appendUser(user);
                            }}
                            key={user._id}
                          />
                        ))}
                    </Box>
                  )}
                  {selectedUsers.length > 0 && (
                    <Box
                      width="100%"
                      color="black"
                      padding="4"
                      height="100px"
                      overflowY="auto"
                    >
                      {selectedUsers.map((user) => (
                        <Tag
                          size="lg"
                          colorScheme="blue"
                          borderRadius="full"
                          key={user._id}
                          py={1}
                          margin={1}
                        >
                          <Avatar
                            src={user.picture}
                            size="sm"
                            name={user.name}
                            mr={2}
                          />
                          <TagLabel>{user.name}</TagLabel>
                          <TagCloseButton
                            onClick={() => {
                              removeUser(user);
                            }}
                          />
                        </Tag>
                      ))}
                    </Box>
                  )}
                  <ModalFooter dir="flex" justifyContent={"center"} gap={2}>
                    <Button
                      colorScheme="facebook"
                      type="submit"
                      isLoading={loading}
                    >
                      Create
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUsers([]);
                        onClose();
                      }}
                      colorScheme="red"
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </Box>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupModal;
