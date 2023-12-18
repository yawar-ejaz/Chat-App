import { Box, VStack, Text, Avatar } from "@chakra-ui/react";
import React from "react";

const Sidebar = () => {
  return (
    <Box w="300px" bg="gray.800" color="white" p={4} boxShadow="xl">
      <VStack spacing={4} align="start">
        <Avatar name="John Doe" src="https://placekitten.com/200/200" />
        <Text fontWeight="bold">John Doe</Text>
        {/* Add more contacts or groups as needed */}
      </VStack>
    </Box>
  );
};

export default Sidebar;
