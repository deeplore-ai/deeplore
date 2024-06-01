import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { PlayerDirection } from "../types";
import { scaleFactor } from "../constants";
import Game from "./Game";

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

export default class Character {
  name: string;
  initialPosition: Vec2;
  speed: number;
  gameObject: GameObj;
  direction: PlayerDirection;
  k: KaboomCtx;
  isMoving: boolean;
  target: { x: number; y: number };
  forbidMoving: boolean;

  constructor(
    name: string,
    initialPosition: Vec2,
    speed: number,
    scaleFactor: number,
    k: KaboomCtx
  ) {
    this.name = name;
    this.initialPosition = initialPosition;
    this.speed = speed;
    this.gameObject = k.make([
      k.sprite("spritesheet", { anim: `${name}-idle-down` }),
      k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(initialPosition),
      k.scale(scaleFactor),
      "name",
    ]);

    this.k = k;
    this.direction = "down";
    this.isMoving = false;
    this.forbidMoving = false;
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

  hear(text: string) {
    fetch("https://app-fqj7trlqhq-od.a.run.app/hear", {
      method: "POST",
      // no cors
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text, npc: "priest", speaker: "Dietrich Hoffman" }),
    }).then((res) => {
      return res.json();
      })
      .then((data) => {
        console.log(data);
        this.speak(data.Speech);
      })
      .catch((e) => {
        console.log(e);
        this.speak("Nolo comprendo");
      });
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
    console.log(x, y, mapWidth, mapHeight);
    return x % mapWidth === 0 && y % mapHeight === 0;
  }

  speak(text: string) {
    const delayByWordsInMs = 350;
    const maxCharsPerLine = 30;
    const words = text.split(" ");
    let lines = [];
    let currentLine = "";
    this.forbidMoving = true;

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    lines.push(currentLine);

    this.displayBubbles(lines);
  }

  private displayBubbles(lines: string[]) {
    if (!lines.length) {
      this.forbidMoving = false;
      return;
    }
    this.displayBubble([lines.shift() || "", lines.shift() || ""], () => {
      this.displayBubbles(lines);
    });
  }

  private displayBubble(lines: string[], closed: () => void) {
    const lineHeight = 12;
    const bubblePadding = 8;
    const bubbleWidth = 250;
    const bubbleHeight = lines.length * lineHeight + bubblePadding * 2;
    const offsetY = 100;
    // Create a bubble
    const bubble = this.k.add([
      this.k.rect(bubbleWidth, bubbleHeight, {
        radius: 5,
      }),
      this.k.pos(
        this.gameObject.pos.x - bubbleWidth / 2,
        this.gameObject.pos.y - offsetY
      ),
      this.k.color(255, 255, 255),
    ]);

    const texts = lines.map((line, index) =>
      this.k.add([
        this.k.text(line.trim(), {
          size: 12,
          font: "monospace",
          transform: {
            color: this.k.rgb(0, 0, 0),
          },
        }),
        this.k.pos(
          this.gameObject.pos.x - bubbleWidth / 2 + bubblePadding, // Adjust the x position
          this.gameObject.pos.y - offsetY + bubblePadding + index * lineHeight // Adjust the y position for each line
        ),
        this.k.color(0, 0, 0),
      ])
    );
    
    const delayByWordsInMs = 350;
    const wordCount = lines.reduce((acc, line) => acc + line.split(" ").length, 0);
    const destroyDelay = delayByWordsInMs * wordCount + 400;

    const bubbleInterval = setInterval(() => {
      if (Game.getInstance().isGamePaused) return;
      bubble.destroy();
      texts.map((t) => t.destroy());
      clearInterval(bubbleInterval);
      closed();
    }, destroyDelay);
  }
}
