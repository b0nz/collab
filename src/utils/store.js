import create from "zustand";
import { createClient } from "@liveblocks/client";
import { middleware } from "@liveblocks/zustand";
import { API_KEY } from "./constants";
import { getRandomColor, getRandomInt } from ".";
import { faker } from "@faker-js/faker";

const client = createClient({
  publicApiKey: API_KEY,
});

const useStore = create(
  middleware(
    (set, get) => ({
      shapes: {},
      selectedShape: null,
      isDragging: false,
      cursor: { x: 0, y: 0 },
      username: faker.name.firstName(),
      setUsername: (username) =>
        set({ username: username || faker.name.firstName() }),
      insertRectangle: () => {
        const { shapes, liveblocks } = get();

        const shapeId = Date.now().toString();
        const shape = {
          x: getRandomInt(300),
          y: getRandomInt(300),
          fill: getRandomColor(),
        };

        liveblocks.room.updatePresence(
          { selectedShape: shapeId },
          { addToHistory: true }
        );
        set({
          shapes: { ...shapes, [shapeId]: shape },
        });
      },
      onShapePointerDown: (shapeId) => {
        const room = get().liveblocks.room;
        room.history.pause();
        room.updatePresence({ selectedShape: shapeId }, { addToHistory: true });
        set({ isDragging: true });
      },
      deleteShape: () => {
        const { shapes, selectedShape, liveblocks } = get();
        const { [selectedShape]: shapeToDelete, ...newShapes } = shapes;
        liveblocks.room.updatePresence(
          { selectedShape: null },
          { addToHistory: true }
        );
        set({
          shapes: newShapes,
        });
      },
      onCanvasPointerUp: () => {
        set({ isDragging: false });
        get().liveblocks.room.history.resume();
      },
      onCanvasPointerMove: (e) => {
        e.preventDefault();

        const { isDragging, shapes, selectedShape } = get();
        const shape = shapes[selectedShape];

        if (shape && isDragging) {
          set({
            cursor: {
              x: Math.round(e.clientX),
              y: Math.round(e.clientY),
            },
            shapes: {
              ...shapes,
              [selectedShape]: {
                ...shape,
                x: e.clientX - 50,
                y: e.clientY - 50,
              },
            },
          });
        } else {
          set({
            cursor: {
              x: Math.round(e.clientX),
              y: Math.round(e.clientY),
            },
          });
        }
      },
    }),
    {
      client,
      storageMapping: { shapes: true },
      presenceMapping: { selectedShape: true, cursor: true, username: true },
    }
  )
);

export default useStore;
