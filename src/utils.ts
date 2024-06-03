import { Vec2 } from "kaboom";
import { scaleFactor } from "./constants";
import { k } from "./lib/ctx";
import { wordsToTruncate } from "./data/wordsToTruncate";
import { Color } from "./color";

export const setupKaboom = () => {
  k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
      "Player-idle-down": 936,
      "Player-walk-down": { from: 936, to: 939, loop: true, speed: 8 },
      "Player-walk-left": { from: 1053, to: 1056, loop: true, speed: 8 },
      "Player-idle-left": 1053,
      "Player-idle-right": 975,
      "Player-walk-right": { from: 975, to: 978, loop: true, speed: 8 },
      "Player-idle-up": 1014,
      "Player-walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },

      "Prof-idle-down": 940,
      "Prof-walk-down": { from: 940, to: 943, loop: true, speed: 8 },
      "Prof-walk-left": { from: 1057, to: 1060, loop: true, speed: 8 },
      "Prof-idle-left": 1057,
      "Prof-idle-right": 979,
      "Prof-walk-right": { from: 979, to: 982, loop: true, speed: 8 },
      "Prof-idle-up": 1018,
      "Prof-walk-up": { from: 1018, to: 1021, loop: true, speed: 8 },

      "Priest-idle-down": 866,
      "Priest-walk-down": { from: 866, to: 867, loop: true, speed: 8 },
      "Priest-walk-left": { from: 907, to: 908, loop: true, speed: 8 },
      "Priest-idle-left": 907,
      "Priest-idle-right": 868,
      "Priest-walk-right": { from: 868, to: 869, loop: true, speed: 8 },
      "Priest-idle-up": 905,
      "Priest-walk-up": { from: 905, to: 906, loop: true, speed: 8 },

      "PetitAmi-idle-down": 944,
      "PetitAmi-walk-down": { from: 944, to: 947, loop: true, speed: 8 },
      "PetitAmi-idle-right": 983,
      "PetitAmi-walk-right": { from: 983, to: 986, loop: true, speed: 8 },
      "PetitAmi-idle-up": 1022,
      "PetitAmi-walk-up": { from: 1022, to: 1025, loop: true, speed: 8 },
      "PetitAmi-idle-left": 1061,
      "PetitAmi-walk-left": { from: 1061, to: 1064, loop: true, speed: 8 },

      "Pere-idle-down": 948,
      "Pere-walk-down": { from: 948, to: 951, loop: true, speed: 8 },
      "Pere-idle-right": 987,
      "Pere-walk-right": { from: 987, to: 990, loop: true, speed: 8 },
      "Pere-idle-up": 1026,
      "Pere-walk-up": { from: 1026, to: 1029, loop: true, speed: 8 },
      "Pere-idle-left": 1065,
      "Pere-walk-left": { from: 1065, to: 1068, loop: true, speed: 8 },

      "Fille-idle-down": 952,
      "Fille-walk-down": { from: 952, to: 955, loop: true, speed: 8 },
      "Fille-idle-right": 991,
      "Fille-walk-right": { from: 991, to: 994, loop: true, speed: 8 },
      "Fille-idle-up": 1030,
      "Fille-walk-up": { from: 1030, to: 1033, loop: true, speed: 8 },
      "Fille-idle-left": 1069,
      "Fille-walk-left": { from: 1069, to: 1072, loop: true, speed: 8 },

      "Mere-idle-down": 956,
      "Mere-walk-down": { from: 956, to: 959, loop: true, speed: 8 },
      "Mere-idle-right": 995,
      "Mere-walk-right": { from: 995, to: 999, loop: true, speed: 8 },
      "Mere-idle-up": 1034,
      "Mere-walk-up": { from: 1034, to: 1037, loop: true, speed: 8 },
      "Mere-idle-left": 1073,
      "Mere-walk-left": { from: 1073, to: 1076, loop: true, speed: 8 },

      "Maire-idle-down": 960,
      "Maire-walk-down": { from: 960, to: 963, loop: true, speed: 8 },
      "Maire-idle-right": 999,
      "Maire-walk-right": { from: 999, to: 1002, loop: true, speed: 8 },
      "Maire-idle-up": 1038,
      "Maire-walk-up": { from: 1038, to: 1041, loop: true, speed: 8 },
      "Maire-idle-left": 1077,
      "Maire-walk-left": { from: 1077, to: 1080, loop: true, speed: 8 },

      "Jaloux-idle-down": 964,
      "Jaloux-walk-down": { from: 964, to: 967, loop: true, speed: 8 },
      "Jaloux-idle-right": 1003,
      "Jaloux-walk-right": { from: 1003, to: 1006, loop: true, speed: 8 },
      "Jaloux-idle-up": 1042,
      "Jaloux-walk-up": { from: 1042, to: 1045, loop: true, speed: 8 },
      "Jaloux-idle-left": 1081,
      "Jaloux-walk-left": { from: 1081, to: 1084, loop: true, speed: 8 },
    },
  });

  k.loadSprite("map", "./map.png");

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
  const words = message.split(" ");

  let countOfRemainingWordsToTruncate = words.length;

  words.forEach((word, index) => {
    if (wordsToTruncate.includes(word)) {
      words[index] = "...";
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

    if (words[index] !== "...") {
      words[index] = "...";
      replacedCount++;
    } else if (replacedCount === words.length) {
      break; // Exit the loop if all words have been replaced
    }
  }

  const joinedWords = new Array<string>();

  for (const word of words) {
    if (word !== "..." || joinedWords[joinedWords.length - 1] !== "...") {
      joinedWords.push(word);
    }
  }

  return joinedWords.join(" ");
};

export const generateShortGuid = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};
