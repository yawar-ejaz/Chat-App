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
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState(
    `https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`
  );

  const { reset, register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    data.pic = pic;
    //now data consists of name, email, password and pic

    setLoading(true);
    try {
      const result = await axios.post("/api/user/sign-up", data);
      toast({
        title: "Account created successfully",
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

  const postDetails = (pic) => {
    if (pic === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
      });
      return;
    }
    setLoading(true);

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chatterbox");
      data.append("cloud_name", "yawar-ejaz");
      fetch("https://api.cloudinary.com/v1_1/yawar-ejaz/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
      });
      setLoading(false);
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
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => postDetails(e.target.files[0])}
          />
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
