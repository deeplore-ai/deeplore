import { DEFAULT_BACKGROUND_COLOR } from "./constants";
import { k } from "./lib/ctx";

export const setupKaboom = () => {
  k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
      "char1-idle-down": 936,
      "char1-walk-down": { from: 936, to: 939, loop: true, speed: 8 },
      "char1-walk-left": { from: 1053, to: 1056, loop: true, speed: 8 },
      "char1-idle-left": 1053,
      "char1-idle-right": 975,
      "char1-walk-right": { from: 975, to: 978, loop: true, speed: 8 },
      "char1-idle-up": 1014,
      "char1-walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
      "char1-attack-up": 1094,
      "char1-attack-down": 1092,
      "char1-attack-left": 1095,
      "char1-attack-right": 1093,

      "char2-idle-down": 940,
      "char2-walk-down": { from: 940, to: 943, loop: true, speed: 8 },
      "char2-walk-left": { from: 1057, to: 1060, loop: true, speed: 8 },
      "char2-idle-left": 1057,
      "char2-idle-right": 979,
      "char2-walk-right": { from: 979, to: 982, loop: true, speed: 8 },
      "char2-idle-up": 1018,
      "char2-walk-up": { from: 1018, to: 1021, loop: true, speed: 8 },
      "char2-attack-up": 1098,
      "char2-attack-down": 1092,
      "char2-attack-left": 1095,
      "char2-attack-right": 1093,
    },
  });

  k.loadSprite("map", "./map.png");

  k.setBackground(k.Color.fromHex(DEFAULT_BACKGROUND_COLOR));
};
