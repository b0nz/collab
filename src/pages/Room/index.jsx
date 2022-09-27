import { Box, Button, HStack, Spinner, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Cursor from "../../components/Cursor";
import useStore from "../../store";
import { COLORS } from "../../utils/constants";
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

  useEffect(() => {
    enterRoom(id, { shapes: {} });

    return () => {
      leaveRoom(id);
    };
  }, [enterRoom, leaveRoom]);

  return (
    <Box
      w="full"
      minH="100vh"
      bgColor="gray.200"
      style={{ touchAction: "none" }}
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
    >
      {isLoading && <Spinner />}
      {!isLoading && (
        <Stack id="stak">
          <div>{id}</div>
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
            <Button onClick={undo}>Undo</Button>
            <Button onClick={redo}>Redo</Button>
          </HStack>
          {Object.entries(shapes).map(([shapeId, shape]) => {
            let selectionColor = "transparent";

            if (selectedShape === shapeId) {
              selectionColor = "blue";
            } else if (
              others.some((user) => user.presence?.selectedShape === shapeId)
            ) {
              selectionColor = "green";
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
        console.log(connectionId);
        return (
          <Cursor
            key={connectionId}
            color={COLORS[connectionId % COLORS.length]}
            x={presence.cursor.x}
            y={presence.cursor.y}
            // message={presence.message}
          />
        );
      })}
    </Box>
  );
};

export default Room;
