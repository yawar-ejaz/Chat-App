import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";

const Root = () => {
  const navigate = useNavigate();

  return (
    <Center minH="100vh" bg="gray.100">
      <Box maxW="md" p="8" bg="gray.300" shadow="lg" rounded="md">
        <Heading as="h1" size="xl" fontWeight="bold" mb="4">
          Chatterbox
        </Heading>
        <Text color="gray.700">
          A simple website for one - one as well as group conversations..
        </Text>
        <Button
          mt="4"
          w="full"
          colorScheme="teal"
          onClick={() => navigate("/home")}
        >
          Get Started
        </Button>
      </Box>
    </Center>
  );
};

export default Root;
