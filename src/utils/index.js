import { COLORS } from "./constants";

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)];
}
