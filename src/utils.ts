import { Vec2 } from "kaboom";
import { scaleFactor } from "./constants";
import { k } from "./lib/ctx";
import { wordsToTruncate } from "./data/wordsToTruncate";
import { Color } from "./color";

export const setupKaboom = () => {
  k.loadSprite(`spritesheet`, `./spritesheet.png`, {
    sliceX: 39,
    sliceY: 31,
    anims: {
      [`Paul_Martinez-idle-down`]: 936,
      [`Paul_Martinez-walk-down`]: { from: 936, to: 939, loop: true, speed: 8 },
      [`Paul_Martinez-walk-left`]: {
        from: 1053,
        to: 1056,
        loop: true,
        speed: 8,
      },
      [`Paul_Martinez-idle-left`]: 1053,
      [`Paul_Martinez-idle-right`]: 975,
      [`Paul_Martinez-walk-right`]: {
        from: 975,
        to: 978,
        loop: true,
        speed: 8,
      },
      [`Paul_Martinez-idle-up`]: 1014,
      [`Paul_Martinez-walk-up`]: { from: 1014, to: 1017, loop: true, speed: 8 },

      [`Dieter_Hoffman-idle-down`]: 940,
      [`Dieter_Hoffman-walk-down`]: {
        from: 940,
        to: 943,
        loop: true,
        speed: 8,
      },
      [`Dieter_Hoffman-walk-left`]: {
        from: 1057,
        to: 1060,
        loop: true,
        speed: 8,
      },
      [`Dieter_Hoffman-idle-left`]: 1057,
      [`Dieter_Hoffman-idle-right`]: 979,
      [`Dieter_Hoffman-walk-right`]: {
        from: 979,
        to: 982,
        loop: true,
        speed: 8,
      },
      [`Dieter_Hoffman-idle-up`]: 1018,
      [`Dieter_Hoffman-walk-up`]: {
        from: 1018,
        to: 1021,
        loop: true,
        speed: 8,
      },

      [`Matthieu_Mancini-idle-down`]: 866,
      [`Matthieu_Mancini-walk-down`]: {
        from: 866,
        to: 867,
        loop: true,
        speed: 8,
      },
      [`Matthieu_Mancini-walk-left`]: {
        from: 907,
        to: 908,
        loop: true,
        speed: 8,
      },
      [`Matthieu_Mancini-idle-left`]: 907,
      [`Matthieu_Mancini-idle-right`]: 868,
      [`Matthieu_Mancini-walk-right`]: {
        from: 868,
        to: 869,
        loop: true,
        speed: 8,
      },
      [`Matthieu_Mancini-idle-up`]: 905,
      [`Matthieu_Mancini-walk-up`]: {
        from: 905,
        to: 906,
        loop: true,
        speed: 8,
      },

      [`Enzo_Muller-idle-down`]: 944,
      [`Enzo_Muller-walk-down`]: { from: 944, to: 947, loop: true, speed: 8 },
      [`Enzo_Muller-idle-right`]: 983,
      [`Enzo_Muller-walk-right`]: { from: 983, to: 986, loop: true, speed: 8 },
      [`Enzo_Muller-idle-up`]: 1022,
      [`Enzo_Muller-walk-up`]: { from: 1022, to: 1025, loop: true, speed: 8 },
      [`Enzo_Muller-idle-left`]: 1061,
      [`Enzo_Muller-walk-left`]: { from: 1061, to: 1064, loop: true, speed: 8 },

      [`Laurent_Dubois-idle-down`]: 948,
      [`Laurent_Dubois-walk-down`]: {
        from: 948,
        to: 951,
        loop: true,
        speed: 8,
      },
      [`Laurent_Dubois-idle-right`]: 987,
      [`Laurent_Dubois-walk-right`]: {
        from: 987,
        to: 990,
        loop: true,
        speed: 8,
      },
      [`Laurent_Dubois-idle-up`]: 1026,
      [`Laurent_Dubois-walk-up`]: {
        from: 1026,
        to: 1029,
        loop: true,
        speed: 8,
      },
      [`Laurent_Dubois-idle-left`]: 1065,
      [`Laurent_Dubois-walk-left`]: {
        from: 1065,
        to: 1068,
        loop: true,
        speed: 8,
      },

      [`Emma_Dubois-idle-down`]: 952,
      [`Emma_Dubois-walk-down`]: { from: 952, to: 955, loop: true, speed: 8 },
      [`Emma_Dubois-idle-right`]: 991,
      [`Emma_Dubois-walk-right`]: { from: 991, to: 994, loop: true, speed: 8 },
      [`Emma_Dubois-idle-up`]: 1030,
      [`Emma_Dubois-walk-up`]: { from: 1030, to: 1033, loop: true, speed: 8 },
      [`Emma_Dubois-idle-left`]: 1069,
      [`Emma_Dubois-walk-left`]: { from: 1069, to: 1072, loop: true, speed: 8 },

      [`Ines_Dubois-idle-down`]: 956,
      [`Ines_Dubois-walk-down`]: { from: 956, to: 959, loop: true, speed: 8 },
      [`Ines_Dubois-idle-right`]: 995,
      [`Ines_Dubois-walk-right`]: { from: 995, to: 999, loop: true, speed: 8 },
      [`Ines_Dubois-idle-up`]: 1034,
      [`Ines_Dubois-walk-up`]: { from: 1034, to: 1037, loop: true, speed: 8 },
      [`Ines_Dubois-idle-left`]: 1073,
      [`Ines_Dubois-walk-left`]: { from: 1073, to: 1076, loop: true, speed: 8 },

      [`Farida_Wang-idle-down`]: 960,
      [`Farida_Wang-walk-down`]: { from: 960, to: 963, loop: true, speed: 8 },
      [`Farida_Wang-idle-right`]: 999,
      [`Farida_Wang-walk-right`]: { from: 999, to: 1002, loop: true, speed: 8 },
      [`Farida_Wang-idle-up`]: 1038,
      [`Farida_Wang-walk-up`]: { from: 1038, to: 1041, loop: true, speed: 8 },
      [`Farida_Wang-idle-left`]: 1077,
      [`Farida_Wang-walk-left`]: { from: 1077, to: 1080, loop: true, speed: 8 },

      [`Jonathan_Chassang-idle-down`]: 964,
      [`Jonathan_Chassang-walk-down`]: {
        from: 964,
        to: 967,
        loop: true,
        speed: 8,
      },
      [`Jonathan_Chassang-idle-right`]: 1003,
      [`Jonathan_Chassang-walk-right`]: {
        from: 1003,
        to: 1006,
        loop: true,
        speed: 8,
      },
      [`Jonathan_Chassang-idle-up`]: 1042,
      [`Jonathan_Chassang-walk-up`]: {
        from: 1042,
        to: 1045,
        loop: true,
        speed: 8,
      },
      [`Jonathan_Chassang-idle-left`]: 1081,
      [`Jonathan_Chassang-walk-left`]: {
        from: 1081,
        to: 1084,
        loop: true,
        speed: 8,
      },
    },
  });

  k.loadSprite(`map`, `./map.png`);

  k.setBackground(Color.black);
};

export function fromXYToGrid(x: number, y: number, cellSize: number) {
  return {
    x: Math.floor(x / scaleFactor / cellSize),
    y: Math.floor(y / scaleFactor / cellSize),
  };
}

export function calculateDistance(pos1: Vec2, pos2: Vec2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export const truncateText = (message: string, distance: number) => {
  const words = message.split(` `);

  let countOfRemainingWordsToTruncate = words.length;

  words.forEach((word, index) => {
    if (wordsToTruncate.includes(word)) {
      words[index] = ".".repeat(word.length);
      countOfRemainingWordsToTruncate--;
    }
  });

  let replacedCount = 0;
  const targetCount = Math.min(
    Math.floor(words.length * (distance / 100)),
    countOfRemainingWordsToTruncate
  );

  while (replacedCount < targetCount) {
    const index = Math.floor(Math.random() * words.length);

    if (words[index].split("").some((value) => value != ".")) {
      words[index] = ".".repeat(words[index].length);
      replacedCount++;
    } else if (replacedCount === words.length) {
      break; // Exit the loop if all words have been replaced
    }
  }

  return words.join(` `);
};

export const generateShortGuid = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
