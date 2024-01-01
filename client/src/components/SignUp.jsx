import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import useAuthContext from "../hooks/useAuthContext";
import { ACTIONS } from "../contexts/authContext";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { reset, register, handleSubmit } = useForm();
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.pic) {
        formData.append("pic", data.pic[0]);
      }

      const result = await axios.post("/api/user/sign-up", formData);
      const user = {
        name: result.data?.name,
        email: result.data?.email,
        picture: result.data?.picture,
        token: result.data?.token,
      };

      dispatch({
        type: ACTIONS.LOGIN,
        payload: user,
      });

      localStorage.setItem("userInfo", JSON.stringify(user));
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || "Internal server error!",
        status: "error",
      });
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <VStack spacing="6px">
        <FormControl isRequired>
          <FormLabel>Name and Email</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your Name"
            {...register(`name`)}
          />
        </FormControl>

        <FormControl isRequired>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            {...register(`email`)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              {...register(`password`)}
            />
            <InputRightElement h={"full"}>
              <IconButton
                icon={show ? <BiSolidHide /> : <BiSolidShow />}
                onClick={() => setShow(!show)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
          <FormLabel>Upload a profile picture (optional)</FormLabel>
          <Input type="file" p={1.5} accept="image/*" {...register(`pic`)} />
        </FormControl>

        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          type="submit"
          isLoading={loading}
        >
          Sign Up
        </Button>
      </VStack>
    </form>
  );
};

export default SignUp;
