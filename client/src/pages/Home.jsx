import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

function Home() {


  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={2}
        bg="white"
        w="100%"
        m="15px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="3xl" fontFamily="Work sans" textAlign="center">
          ChatterBox
        </Text>
      </Box>
      <Box bg="white" w="100%" p={2} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted>
          <TabList mb="1em">
            <Tab>Sign In</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SignIn />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
