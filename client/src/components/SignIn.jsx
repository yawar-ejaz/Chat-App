import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignIn = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { reset, register, handleSubmit } = useForm();

  const navigate = useNavigate();
  //   const { setUser } = ChatState();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post("/api/user/sign-in", data);
      toast({
        title: "Login successful",
        status: "success",
      });
      const user = {
        name: result.data?.name,
        email: result.data?.email,
        token: result.data?.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(user));
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing="20px">
      <form onSubmit={handleSubmit(submitHandler)}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" {...register("email")} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              {...register("password")}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          type="submit"
          isLoading={loading}
        >
          Login
        </Button>
      </form>
    </VStack>
  );
};

export default SignIn;
