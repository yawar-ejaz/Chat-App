import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const toast = useToast();

  const { reset, register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    data.pic = data.pic[0];
    if (data.pic === undefined) {
      data.pic = `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`;
    }
    console.log(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("pic", data.pic);
    console.log(formData);

    try {
      const result = await axios.post("/api/user/sign-up", formData);
      const user = {
        name: result.data?.name,
        email: result.data?.email,
        picture: result.data?.picture,
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
    }
  };

  return (
    <VStack spacing="6px">
      <form onSubmit={handleSubmit(submitHandler)}>
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
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? "Hide" : "Show"}
              </Button>
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
        >
          Sign Up
        </Button>
      </form>
    </VStack>
  );
};

export default SignUp;
