import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  IconButton,
  useToast,
  VStack,
  Input,
  Box,
  Tag,
  Avatar,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UserListItem from "./UserListItem";

const AddMembersModal = ({ setData, children }) => {
  const toast = useToast();
  const { user } = useAuthContext();
  const { selectedChatId } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [foundUsers, setFoundUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { reset, register, handleSubmit } = useForm();

  const findUsers = async (search) => {
    try {
      setLoading(true);
      const result = await axios.get(`/api/user/search?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFoundUsers(result?.data);
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

  const appendUser = (userToAdd) => {
    setSelectedUsers([...selectedUsers, userToAdd]);
    setSearch("");
  };

  const removeUser = (userToRemove) => {
    const updatedUsers = selectedUsers.filter((user) => user !== userToRemove);
    setSelectedUsers(updatedUsers);
  };

  const submitHandler = async () => {
    setLoading(true);
    const id = selectedUsers.map((user) => user._id);
    try {
      const result = await axios.patch(
        `/api/chat/group/${selectedChatId}?type=add`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setData(result?.data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Internal server error",
        status: "error",
      });
    } finally {
      reset();
      setSelectedUsers([]);
      onClose();
      setLoading(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            textAlign={"center"}
          >
            Add Members
          </ModalHeader>

          <ModalBody minH={"30vh"}>
            <form onSubmit={handleSubmit(submitHandler)}>
              <VStack spacing="10px">
                <Box position="relative" width="100%">
                  <Input
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                  {search && (
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
                    <div className="min-h-[10vh] w-full flex flex-wrap py-3 max-h-[30vh] overflow-y-auto">
                      {selectedUsers.map((user) => (
                        <Tag
                          size="lg"
                          colorScheme="blue"
                          borderRadius="full"
                          key={user._id}
                          py={1}
                          margin={1}
                          width={"fit-content"}
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
                    </div>
                  )}
                </Box>
                <div className="w-full py-2 flex justify-center gap-2">
                  <Button
                    colorScheme="facebook"
                    type="submit"
                    isLoading={loading}
                  >
                    Add
                  </Button>
                  <Button onClick={onClose} colorScheme="red">
                    Close
                  </Button>
                </div>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddMembersModal;
