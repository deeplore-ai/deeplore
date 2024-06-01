import { DEFAULT_BACKGROUND_COLOR } from "./constants";
import { k } from "./lib/ctx";

export const setupKaboom = () => {
  k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
      "idle-down": 936,
      "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
      "walk-left": { from: 1053, to: 1056, loop: true, speed: 8 },
      "idle-left": 1053,
      "idle-right": 975,
      "walk-right": { from: 975, to: 978, loop: true, speed: 8 },
      "idle-up": 1014,
      "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
      "attack-up": 1094,
      "attack-down": 1092,
      "attack-left": 1095,
      "attack-right": 1093,
    },
  });

  k.loadSprite("map", "./map.png");

  k.setBackground(k.Color.fromHex(DEFAULT_BACKGROUND_COLOR));
};
