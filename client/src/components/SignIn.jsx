import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IconButton } from "@chakra-ui/react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../contexts/authContext";

const SignIn = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { reset, register, handleSubmit } = useForm();
  const { dispatch } = useAuthContext();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const result = await axios.post("/api/user/sign-in", data);

      const user = {
        _id: result.data?._id,
        name: result.data?.name,
        email: result.data?.email,
        picture: result.data?.picture,
        token: result.data?.token,
      };

      dispatch({
        type: ACTIONS.LOGIN,
        payload: user,
      });
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
    <form onSubmit={handleSubmit(submitHandler)}>
      <VStack spacing="20px">
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" autoComplete="off" {...register("email")} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              autoComplete="off"
              {...register("password")}
            />
            <InputRightElement h={"full"}>
              <IconButton
                icon={show ? <BiSolidHide /> : <BiSolidShow />}
                onClick={() => setShow(!show)}
              />
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
      </VStack>
    </form>
  );
};

export default SignIn;
