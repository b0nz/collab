import React from "react";
import ReactDOM from "react-dom/client";
import { Box, ChakraProvider, Heading } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Room from "./pages/Room";
import ErrorBoundary from "./ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/room",
    element: (
      <Box
        w="full"
        minH="100vh"
        bgColor="gray.900"
        display="flex"
        justifyContent="center"
        alignItems="center"
        color="white"
      >
        <Heading>Please enter your room id</Heading>
      </Box>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/room/:id",
    element: <Room />,
    errorElement: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
