import React, { useEffect } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";

const MyChats = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchAllChats = async () => {
      const result = await axios.get("/api/chat/all-chats", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    //   console.log(result);
    };
    fetchAllChats();
  }, []);
  return (
    <Box height="100%" backgroundColor={"black"}>
      hello
    </Box>
  );
};

export default MyChats;
