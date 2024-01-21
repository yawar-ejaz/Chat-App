import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";

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
  Avatar,
  useToast,
} from "@chakra-ui/react";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";
import AddMembersModal from "./AddMembersModal";
import UserListItem from "./UserListItem";
import axios from "axios";

const MembersModal = ({ data, setData, children }) => {
  const toast = useToast();

  const { user } = useAuthContext();
  const { selectedChatId } = useChatContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const removeUser = async (id) => {
    setLoading(true);
    try {
      const result = await axios.patch(
        `/api/chat/group/${selectedChatId}?type=remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setData(result?.data);
      toast({
        title: "Removed successfully",
        status: "success",
      });
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

  return (
    <>
      {children && <span onClick={onOpen}>{children}</span>}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="w-full items-center flex justify-center border-b-2 border-gray-700 py-1">
              <Avatar
                mr={4}
                size="lg"
                cursor="pointer"
                name={data?.chatName}
                src={data?.picture}
              />
              <p className="text-3xl">{data?.chatName}</p>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="max-h-[30vh] overflow-y-auto">
              {data?.users?.map((user) => (
                <UserListItem
                  key={user?._id}
                  member={user}
                  adminId={data?.groupAdminId}
                  removeUser={removeUser}
                />
              ))}
            </div>
          </ModalBody>
          <ModalFooter
            display={"flex"}
            justifyContent={"center"}
            width={"100%"}
            gap={2}
          >
            <Button onClick={onClose} colorScheme="red">
              Close
            </Button>
            {user._id === data?.groupAdminId && (
              <AddMembersModal setData={setData}>
                <Button colorScheme="facebook" isLoading={loading}>
                  Add Member
                </Button>
              </AddMembersModal>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MembersModal;
