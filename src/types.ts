import { GameObj } from "kaboom";

export type PlayerMovement = {
  move: (player: GameObj) => void;
  animToPlay: string;
};
export type PlayerDirection = "up" | "down" | "left" | "right";

export type MoveType = "idle" | "walk" | "attack";

export type PlayerState = {
  id: string;
  player: GameObj;
  lastAnim: string;
};

export type Position = {
  x: number;
  y: number;
};
