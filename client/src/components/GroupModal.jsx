import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  VStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Box,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";

import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UserListItem from "./UserListItem";

const GroupModal = () => {
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
        description: error.message,
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

  return (
    <>
      <Button colorScheme="green" size="sm" variant="solid" onClick={onOpen}>
        + Group
      </Button>
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          h="540px"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
        >
          <ModalHeader
            fontSize="20px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <form onSubmit={() => {}}>
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
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                  {search && (
                    <Box
                      width="100%"
                      height="200px"
                      color="black"
                      padding="4"
                      overflowY="auto"
                      border="2px solid black"
                      position="absolute"
                      top="42px"
                      zIndex={1}
                    >
                      {loading ? (
                        <></>
                      ) : (
                        foundUsers.map((user) => (
                          <UserListItem
                            user={user}
                            handleFunction={() => {
                              appendUser(user);
                            }}
                            key={user._id}
                          />
                        ))
                      )}
                    </Box>
                  )}
                  {selectedUsers && (
                    <Box
                      width="100%"
                      height="200px"
                      color="black"
                      padding="4"
                      overflowY="auto"
                      position="absolute"
                      top="42px"
                      zIndex={0}
                    >
                      {selectedUsers.map((user) => (
                        <Tag
                          size="lg"
                          colorScheme="red"
                          borderRadius="full"
                          key={user._id}
                        >
                          <Avatar
                            src={user.picture}
                            size="sm"
                            name={user.name}
                            mt={1}
                          />
                          <TagLabel>{user.name}</TagLabel>
                          <TagCloseButton onClick={()=>{removeUser(user)}}/>
                        </Tag>
                        //    console.log(user)
                      ))}
                    </Box>
                  )}

                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    mt={5}
                    position="absolute"
                    top="250px"
                  >
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
                  </Box>
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
