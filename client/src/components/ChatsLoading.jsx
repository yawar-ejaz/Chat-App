import { Stack } from "@chakra-ui/layout";
import { Tr, Td } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatsLoading = () => {
  return (
        <Stack>
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
          <Skeleton height="45px" />
        </Stack>
  );
};

export default ChatsLoading;
