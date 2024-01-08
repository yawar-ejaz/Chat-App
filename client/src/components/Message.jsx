import React from "react";
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
  Text,
  TagCloseButton,
  TagLabel,
  VStack,
  useDisclosure,
  useToast,
  Divider,
} from "@chakra-ui/react";

const Message = ({ name, message }) => {
  return (
    <div style={styles.messageContainer}>
      <Text fontSize="xs" as="b">{name}</Text>
      <Text fontSize="xs">{message}</Text>
    </div>
  );
};

const styles = {
    messageContainer: {
        float: "right",
    maxWidth: "70%", // Adjust the width as needed
    margin: "5px",
    padding: "5px",
    borderRadius: "8px",
    backgroundColor: "#DCF8C6", // Adjust the background color as needed
    alignSelf: "flex-start",
  },
  senderName: {
    fontWeight: "bold",
  },
  message: {
    wordWrap: "break-word",
  },
};

export default Message;



