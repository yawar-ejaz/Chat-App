import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { memo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileUpload } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import useAuthContext from "../hooks/useAuthContext";
import useChatContext from "../hooks/useChatContext";

const AttachmentModal = ({ setMessages }) => {
  const toast = useToast();
  const { user } = useAuthContext();
  const { selectedChatId } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    onDrop: (newAcceptedFiles) => {
      const file = newAcceptedFiles[0];
      setAcceptedFiles([file]);
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    formData.append("fileName", acceptedFiles[0].path);

    try {
      setLoading(true);

      const result = await axios.post(
        `/api/message/attachment/${selectedChatId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages((prev) => [...prev, result.data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error?.response?.data?.message || "Internal Server Error",
        status: "error",
      });
    } finally {
      onClose();
      setLoading(false);
      setAcceptedFiles([]);
    }
  };

  return (
    <>
      <ImAttachment
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
        onClick={onOpen}
      />
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>Attach a File</ModalHeader>
          <Divider />
          <ModalBody>
            <section>
              <div
                className="dropzone p-5 bg-gray-100 cursor-pointer focus:outline-none"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <FaFileUpload className="mx-auto mb-4 text-blue-600 h-20 w-20" />
                <p className="text-center">
                  Drag 'n' drop a file here, or click to select a file
                </p>
              </div>
              {!!files.length && (
                <p className="text-center list-none my-3">{files}</p>
              )}
            </section>
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

            <Button
              onClick={handleFileUpload}
              isLoading={loading}
              colorScheme="facebook"
              isDisabled={!acceptedFiles.length}
            >
              Attach
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default memo(AttachmentModal);
