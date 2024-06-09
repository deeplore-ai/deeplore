import { GameObj, KaboomCtx, PosComp, TextComp, Vec2 } from "kaboom";
import { PlayerDirection } from "../types";
import {
  MAX_LISTEN_RANGE,
  scaleFactor,
  START_TRUNCATED_RANGE,
} from "../constants";
import Game from "./Game";
import {
  calculateDistance,
  fromGridToDirection,
  fromXYToGrid,
  truncateText,
} from "../utils";
import EventBus from "./EventBus";
import { Color } from "../color";
import { js as Easystar } from "easystarjs";
import { hear } from "../lib/hear";
import { Player } from "./Player";

export const characterNames = [
  "Dieter_Hoffman",
  "Emma_Dubois",
  "Enzo_Muller",
  "Farida_Wang",
  "Ines_Dubois",
  "Jeanne_Costa",
  "Jonathan_Chassang",
  "Laurent_Dubois",
  "Matthieu_Mancini",
  "Paul_Martinez",
] as const;

export type CharacterName = (typeof characterNames)[number];

export type PlayerMovement = {
  move: (character: Character) => void;
  animToPlay: string;
};

const movement: {
  [key in PlayerDirection]: PlayerMovement;
} = {
  up: {
    move: (character: Character) => {
      character.gameObject.move(0, -character.speed);
    },
    animToPlay: "walk-up",
  },
  down: {
    move: (character: Character) => {
      character.gameObject.move(0, character.speed);
    },
    animToPlay: "walk-down",
  },
  left: {
    move: (character: Character) => {
      character.gameObject.move(-character.speed, 0);
    },
    animToPlay: "walk-left",
  },
  right: {
    move: (character: Character) => {
      character.gameObject.move(character.speed, 0);
    },
    animToPlay: "walk-right",
  },
};

export type CharacterConstructor = {
  name: CharacterName;
  initialPosition: Vec2;
  speed: number;
  scaleFactor: number;
  k: KaboomCtx;
  firstName: string;
  lastName: string;
  player: Player | null;
  tagList?: string[];
};

export default class Character {
  name: CharacterName;
  initialPosition: Vec2;
  speed: number;
  gameObject: GameObj;
  direction: PlayerDirection;
  k: KaboomCtx;
  isMoving: boolean;
  target?: { x: number; y: number };
  forbidMoving: boolean;
  firstName: string;
  lastName: string;
  player: Player | null;
  thinkingBubble: GameObj | null = null;
  thinkingText: GameObj<PosComp | TextComp> | null = null;

  /**
   * The full text that the character is speaking.
   * It can grow over time as the character speaks.
   */
  #speaking = "";

  get speaking() {
    return this.#speaking;
  }

  set speaking(text: string) {
    this.#speaking = text;
    const words = text.split(" ");
    const speakingLines = new Array<Array<string>>();
    this.speakingLines = [];

    let lineIndex = 0;

    words.forEach((word) => {
      const newLineWords = [...(speakingLines[lineIndex] ?? []), word];
      const newLineText = newLineWords.join(" ");

      if (newLineText.length > 30) {
        lineIndex++;
        speakingLines[lineIndex] = [word];
        this.speakingLines[lineIndex] = word;
      } else {
        speakingLines[lineIndex] = newLineWords;
        this.speakingLines[lineIndex] = newLineText;
      }
    });
  }

  /**
   * A derived value from this.speaking.
   */
  speakingLines = new Array<string>();

  /**
   * The last character line/word/character.
   */
  speakingOffset = {
    line: 0,
    character: 0,
  };

  isSpeaking = false;
  speakingCharacter = 0;

  constructor({
    name,
    initialPosition,
    speed,
    scaleFactor,
    k,
    firstName,
    lastName,
    player,
    tagList = ["npc"]
  }: CharacterConstructor) {
    this.name = name;
    this.initialPosition = initialPosition;
    this.speed = speed;
    this.gameObject = k.make([
      k.sprite("spritesheet", { anim: `${name}-idle-down` }),
      k.area({
        shape: new k.Rect(k.vec2(0, 2), 12, 16),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(initialPosition),
      k.scale(scaleFactor),
      name,
      ...tagList
    ]);

    this.k = k;
    this.direction = "down";
    this.isMoving = false;
    this.forbidMoving = false;
    this.firstName = firstName;
    this.lastName = lastName;
    this.player = player;
  }

  startMovement(direction: PlayerDirection) {
    this.direction = direction;
    this.gameObject.play(this.name + "-" + movement[direction].animToPlay);
    this.isMoving = true;
  }

  stopMovement() {
    this.playIdleAnimation();
    this.isMoving = false;
  }

  setTarget(target: { x: number; y: number }) {
    this.target = target;
  }

  move(direction: PlayerDirection) {
    if (Game.getInstance().isGamePaused || this.forbidMoving) return;
    movement[direction].move(this);
    this.direction = direction;
  }

  async hear(text: string, speaker: Character) {
    if (!text) return;

    const shouldAnswer =
      !this.isThinking() &&
      !this.isSpeaking &&
      this.playerIsTalkingToMe();
    if (shouldAnswer) {
      this.startThinking();
    }
    const obfuscatedText = this.obfuscateBasedOnDistance(text, speaker);
    try {
      const responseStream = hear({
        speaker: speaker,
        listener: this,
        text: obfuscatedText,
        shouldAnswer,
      });

      this.speaking = "";

      for await (const response of responseStream) {
        this.speaking += response;
        this.startSpeaking();
      }
    } catch (e) {
      if (shouldAnswer) {
        this.speaking = "Nolo comprendo, mi amigo! Soy un gogolo...";
        this.startSpeaking();
      }
    } finally {
      this.stopThinking();
    }
  }

  playerIsTalkingToMe() {
    return (
      calculateDistance(this.gameObject.pos, this.player?.gameObject.pos) <
        START_TRUNCATED_RANGE &&
      (this.player?.interlocutorCollider.interlocutor === null ||
        this.player?.interlocutorCollider.interlocutor === this.gameObject)
    );
  }

  isThinking() {
    return this.thinkingBubble;
  }

  playAnimation(animation: string) {
    this.gameObject.play(animation);
  }

  playIdleAnimation() {
    this.gameObject.play(`${this.name}-idle-${this.direction}`);
  }

  movementNeeded(mapWidth: number, mapHeight: number) {
    const x = this.gameObject.pos.x / scaleFactor;
    const y = this.gameObject.pos.y / scaleFactor;
    return x % mapWidth === 0 && y % mapHeight === 0;
  }

  obfuscateBasedOnDistance(
    line: string,
    speakingCharacter: Character | null
  ): string {
    if (!speakingCharacter) return line;
    const distance = calculateDistance(
      this.gameObject.pos,
      speakingCharacter.gameObject.pos
    );
    if (distance > START_TRUNCATED_RANGE && distance < MAX_LISTEN_RANGE) {
      return truncateText(line, distance - START_TRUNCATED_RANGE);
    }
    return line;
  }

  async startThinking() {
    this.thinkingBubble = this.k.add([
      this.k.rect(50, 28, {
        radius: 5,
      }),
      this.k.pos(this.gameObject.pos.x - 50 / 2, this.gameObject.pos.y - 80),
      this.k.color(255, 255, 255),
    ]);
    let i = 0;
    this.thinkingText = this.k.add([
      this.k.text("", {
        size: 24,
        font: "monospace",
        transform: {
          color: this.k.rgb(0, 0, 0),
        },
      }),
      this.k.pos(this.gameObject.pos.x - 50 / 2, this.gameObject.pos.y - 80),
    ]);
    while (this.thinkingBubble) {
      i++;
      await this.k.wait(0.1);
      if (!this.thinkingText) {
        continue;
      }
      this.thinkingText.text = ".".repeat(i);
      if (i > 3) {
        i = 0;
        this.thinkingText.text = "";
      }
    }
  }

  stopThinking() {
    this.thinkingBubble?.destroy();
    this.thinkingText?.destroy();
    this.thinkingBubble = null;
    this.thinkingText = null;
  }

  async startSpeaking() {
    if (this.isSpeaking) {
      return; // the character is already speaking
    }

    this.stopThinking();
    this.forbidMoving = true;
    this.isSpeaking = true;
    this.speakingOffset.character = 0;
    this.speakingOffset.line = 0;

    // Text setup
    const lineHeight = 30;
    const fontSize = 16;

    //Bubble setup
    const bubblePadding = 20;
    const bubbleWidth = 350;
    const bubbleRadius = 3;
    const bubbleHeight = 2 * lineHeight + bubblePadding * 2;
    const offsetY = 150;

    const contentBubbleX = this.gameObject.pos.x - bubbleWidth / 2;
    const contentBubbleY = this.gameObject.pos.y - offsetY;

    // Border bubble setup
    const bubbleBorderWidth = 6;
    const borderBubbleWidth = bubbleWidth + bubbleBorderWidth;
    const borderBubbleHeight = bubbleHeight + bubbleBorderWidth;
    const borderBubbleX =
      this.gameObject.pos.x - bubbleWidth / 2 - bubbleBorderWidth / 2;
    const borderBubbleY =
      this.gameObject.pos.y - offsetY - bubbleBorderWidth / 2;

    // Text setup
    const textX = this.gameObject.pos.x - bubbleWidth / 2 + bubblePadding;
    const firstTextY = this.gameObject.pos.y - offsetY + bubblePadding;
    const secondTextY =
      this.gameObject.pos.y - offsetY + bubblePadding + lineHeight;

    // Border bubble
    const bubbleBorder = this.k.add([
      this.k.rect(borderBubbleWidth, borderBubbleHeight, {
        radius: bubbleRadius,
      }),
      this.k.pos(borderBubbleX, borderBubbleY),
      this.k.color(0, 0, 0),
    ]);

    // Border content bubble
    const bubbleContent = this.k.add([
      this.k.rect(bubbleWidth, bubbleHeight, {
        radius: bubbleRadius,
      }),
      this.k.pos(contentBubbleX, contentBubbleY),
      this.k.color(255, 255, 255),
    ]);

    const textFirstLine = this.k.add([
      this.k.text("", {
        size: fontSize,
        font: "monospace",
        transform: {
          color: Color.black,
        },
      }),
      this.k.pos(textX, firstTextY),
    ]);

    const textSecondLine = this.k.add([
      this.k.text("", {
        size: fontSize,
        font: "monospace",
        transform: {
          color: Color.black,
        },
      }),
      this.k.pos(textX, secondTextY),
    ]);

    while (true) {
      const line = this.speakingLines[this.speakingOffset.line];
      const character = line[this.speakingOffset.character];
      const isLastLine =
        this.speakingOffset.line >= this.speakingLines.length - 1;
      const isLastCharacter =
        this.speakingOffset.character >=
        this.speakingLines[this.speakingOffset.line].length;

      if (isLastLine && isLastCharacter) {
        if (this.isSpeaking) {
          await this.k.wait(1);
          this.isSpeaking = false;
        }
        break;
      }

      const obfuscatedLine = this.obfuscateBasedOnDistance(
        this.speakingLines[this.speakingOffset.line],
        this.player
      );
      const obfuscatedCharacter = obfuscatedLine[this.speakingOffset.character];
      textSecondLine.text += obfuscatedCharacter;
      this.speakingOffset.character++;

      if (this.speakingOffset.character == line.length) {
        if (!isLastLine) {
          textFirstLine.text = textSecondLine.text;
          textSecondLine.text = "";
          this.speakingOffset.character = 0;
          this.speakingOffset.line++;
        }
      }

      await this.k.wait(character === "." ? 0.1 : 0.03);
    }

    await this.k.wait(1);

    bubbleBorder.destroy();
    bubbleContent.destroy();

    this.speakingLines = [];

    textFirstLine.destroy();
    textSecondLine.destroy();
    this.forbidMoving = false;
    EventBus.publish("character:speak", { speaker: this });
  }

  recalculatePath(easystar: Easystar) {
    if (!this.target) return;
    const charGridPos = fromXYToGrid(
      this.gameObject.pos.x,
      this.gameObject.pos.y,
      16
    );
    const targetGridPos = fromXYToGrid(this.target.x, this.target.y, 16);
    easystar.findPath(
      charGridPos.x,
      charGridPos.y,
      targetGridPos.x,
      targetGridPos.y,
      (path: { x: number; y: number }[]) => {
        if (path && path.length > 1) {
          this.direction = fromGridToDirection(
            path[1],
            charGridPos
          ) as PlayerDirection;
        }
        this.recalculatePath(easystar);
      }
    );
    easystar.calculate();
  }
}
