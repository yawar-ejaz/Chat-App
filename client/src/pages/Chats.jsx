import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/SideDrawer";
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";

const Chats = () => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <SideDrawer />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          width="100%"
          height="91.5vh"
          padding="10px"
        >
          <MyChats />
          <ChatWindow />
        </Box>
      </div>
    </>
  );
};

export default Chats;
