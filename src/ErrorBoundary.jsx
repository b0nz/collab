import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export default function ErrorBoundary() {
  let error = useRouteError();

  return (
    <Box
      w="full"
      minH="100vh"
      bgColor="gray.900"
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="white"
    >
      <Stack alignItems="center">
        <Heading>Oops..</Heading>
        <Text>{error?.statusText}</Text>
      </Stack>
    </Box>
  );
}
