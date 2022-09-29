import { LinkIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tooltip,
  useClipboard,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Cursor from "../../components/Cursor";
import useStore from "../../utils/store";
import { COLORS } from "../../utils/constants";
import _ from "lodash";
import "./style.css";

const Rectangle = ({ shape, selectionColor, id }) => {
  const onShapePointerDown = useStore((state) => state.onShapePointerDown);

  return (
    <div
      className="rectangle"
      style={{
        transform: `translate(${shape.x}px, ${shape.y}px)`,
        backgroundColor: shape.fill ? shape.fill : "#CCC",
        borderColor: selectionColor,
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onShapePointerDown(id);
      }}
    ></div>
  );
};

const Room = () => {
  const { id } = useParams();
  const {
    shapes,
    username,
    setUsername,
    insertRectangle,
    selectedShape,
    deleteShape,
    onCanvasPointerMove,
    onCanvasPointerUp,
    liveblocks,
  } = useStore();
  const { others, enterRoom, leaveRoom, isLoading, room } = liveblocks;
  const undo = room?.history.undo;
  const redo = room?.history.redo;
  const { onCopy } = useClipboard(window.location.href);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    enterRoom(id, {
      shapes: {},
      selectedShape: null,
      isDragging: false,
      cursor: { x: 0, y: 0 },
      username: null,
    });
    return () => {
      leaveRoom(id);
    };
  }, [enterRoom, leaveRoom]);

  return (
    <Box
      w="full"
      minH="100vh"
      bgColor="white"
      style={{ touchAction: "none" }}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
    >
      {isLoading && <Spinner />}
      {!isLoading && (
        <Stack>
          <HStack p="4" justifyContent="space-between">
            <HStack>
              <Button colorScheme="green" onClick={insertRectangle}>
                Rectangle
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteShape}
                disabled={selectedShape == null}
              >
                Delete
              </Button>
              <Button variant="outline" colorScheme="blackAlpha" onClick={undo}>
                Undo
              </Button>
              <Button variant="outline" colorScheme="blackAlpha" onClick={redo}>
                Redo
              </Button>
            </HStack>
            <HStack>
              <AvatarGroup spacing="-0.5" fontSize="xs" size="sm" max={2}>
                {others.map(({ connectionId, presence }) => (
                  <Avatar
                    
                    key={connectionId}
                    bgColor={COLORS[connectionId % COLORS.length]}
                    name={presence?.username}
                  />
                ))}
              </AvatarGroup>
              <Tooltip hasArrow label="Copy Link" placemnet="auto">
                <IconButton
                  variant="ghost"
                  colorScheme="blackAlpha"
                  onClick={() => {
                    onCopy();
                    toast({
                      title: "Link Coppied",
                      status: "success",
                      position: "bottom-right",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                  icon={<LinkIcon />}
                />
              </Tooltip>
              <Tooltip hasArrow label="Settings" placement="auto">
                <IconButton
                  variant="ghost"
                  colorScheme="blackAlpha"
                  onClick={onOpen}
                  icon={<SettingsIcon />}
                />
              </Tooltip>
            </HStack>
          </HStack>
          {/* Modal Settings */}
          <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Settings</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="Input username"
                    defaultValue={username}
                    onChange={_.debounce((e) => {
                      setUsername(e.target.value);
                    }, 1000)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter />
            </ModalContent>
          </Modal>
          {/* ==== */}
          {Object.entries(shapes).map(([shapeId, shape]) => {
            let selectionColor = "transparent";

            if (selectedShape === shapeId) {
              selectionColor = "black";
            } else if (
              others.some((user) => user.presence?.selectedShape === shapeId)
            ) {
              selectionColor = "yellow";
            }

            return (
              <Rectangle
                id={shapeId}
                key={shapeId}
                shape={shape}
                selectionColor={selectionColor}
              />
            );
          })}
        </Stack>
      )}
      {others.map(({ connectionId, presence }) => {
        if (presence === null || !presence.cursor) {
          return null;
        }

        return (
          <Cursor
            key={connectionId}
            color={COLORS[connectionId % COLORS.length]}
            x={presence?.cursor?.x}
            y={presence?.cursor?.y}
            label={presence?.username}
          />
        );
      })}
    </Box>
  );
};

export default Room;
