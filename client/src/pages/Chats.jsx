import { useState } from "react";
import ChatWindow from "../components/ChatWindow";
import MyChats from "../components/MyChats";
import Navbar from "../components/Navbar";
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react";

const Chats = () => {
  return (
    <main className="h-[100dvh] ">
      <section className="h-full fixed inset-y-0 w-80 border-r">
        <MyChats />
      </section>
      <section className="h-full ml-80 w-full">
              <ChatWindow />
              <p className="text-xl">jdshoadf34</p>
      </section>
    </main>
  );
};

export default Chats;
