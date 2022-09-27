import { Box, Text } from "@chakra-ui/react";

export default function Cursor({ color, x, y }) {
  return (
    <Box
      top={0}
      left={0}
      position="absolute"
      style={{
        pointerEvents: "none",
        transition: "transform 120ms linear",
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <svg
        style={{ position: "relative" }}
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      {/* {message && (
        <Box
          pos="absolute"
          top={5}
          left={2}
          px={4}
          py={2}
          rounded="3xl"
          style={{ backgroundColor: color }}
        >
          <Text
            lineHeight={1.625}
            color="white"
            whiteSpace="nowrap"
            fontSize="sm"
          >
            {message}
          </Text>
        </Box>
      )} */}
    </Box>
  );
}
