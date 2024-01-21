import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Tag, TagLabel } from "@chakra-ui/react";
import useAuthContext from "../hooks/useAuthContext";

const UserListItem = ({
  member,
  adminId,
  handleFunction,
  removeUser,
}) => {
  const { user } = useAuthContext();

  return (
    <Box
      cursor="pointer"
      bg="white"
      onClick={handleFunction}
      _hover={{
        background: "#4267B2",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={2}
      py={1}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={member.name}
        src={member.picture}
      />
      <div>
        <p>{member.name}</p>
        <Text fontSize="xs">{member.email}</Text>
      </div>
      {adminId && adminId === member._id && (
        <Tag
          size="sm"
          colorScheme="blue"
          borderRadius="full"
          marginLeft={"auto"}
        >
          <TagLabel>Group Admin</TagLabel>
        </Tag>
      )}
      {adminId && adminId !== member._id && adminId === user._id && (
        <Button
          colorScheme="red"
          marginLeft={"auto"}
          size={"xs"}
          onClick={() => {
            removeUser(member._id);
          }}
        >
          Remove
        </Button>
      )}
    </Box>
  );
};

export default UserListItem;
