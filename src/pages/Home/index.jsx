import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      w="full"
      minH="100vh"
      bgColor="gray.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box p="8" pb="12" bgColor="white" w="full" maxW="lg" borderRadius="md">
        <VStack divider={<Divider my="4" />} gap="2">
          <VStack w="full" gap="2">
            <Center>
              <Heading size="lg" color="gray.700">
                ONLINE COLLAB
              </Heading>
            </Center>
            <Button
              w="full"
              colorScheme="teal"
              onClick={() => {
                navigate(`/room/${uuidv4()}`);
              }}
            >
              Generate Room
            </Button>
          </VStack>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/room/${e.target.room_id.value}`);
            }}
            style={{ width: "100%" }}
          >
            <VStack w="full" gap="2">
              <Input name="room_id" placeholder="Input room code" required />
              <Button w="full" colorScheme="teal" type="submit">
                Join Room
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default Home;
