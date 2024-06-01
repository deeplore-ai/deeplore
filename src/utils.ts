import { Vec2 } from "kaboom";
import { DEFAULT_BACKGROUND_COLOR, scaleFactor } from "./constants";
import { k } from "./lib/ctx";
import { wordsToTruncate } from "./data/wordsToTruncate";

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

      "Girl-idle-down": 940,
      "Girl-walk-down": { from: 940, to: 943, loop: true, speed: 8 },
      "Girl-walk-left": { from: 1057, to: 1060, loop: true, speed: 8 },
      "Girl-idle-left": 1057,
      "Girl-idle-right": 979,
      "Girl-walk-right": { from: 979, to: 982, loop: true, speed: 8 },
      "Girl-idle-up": 1018,
      "Girl-walk-up": { from: 1018, to: 1021, loop: true, speed: 8 },

      "Priest-idle-down": 866,
      "Priest-walk-down": { from: 866, to: 867, loop: true, speed: 8 },
      "Priest-walk-left": { from: 907, to: 908, loop: true, speed: 8 },
      "Priest-idle-left": 907,
      "Priest-idle-right": 868,
      "Priest-walk-right": { from: 868, to: 869, loop: true, speed: 8 },
      "Priest-idle-up": 905,
      "Priest-walk-up": { from: 905, to: 906, loop: true, speed: 8 },
    },
  });

  k.loadSprite("map", "./map.png");

  k.setBackground(k.Color.fromHex(DEFAULT_BACKGROUND_COLOR));
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
