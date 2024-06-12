import { Color as KaboomColor } from "kaboom";
import { k } from "./lib/ctx";

export const Color: Record<string, KaboomColor> = {
  black: k.BLACK,
  white: k.WHITE,
  purple: new k.Color(139, 39, 71)
};
