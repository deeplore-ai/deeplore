import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { PlayerDirection } from "../types";

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

    constructor(name: string, initialPosition: Vec2, speed: number, scaleFactor: number, k: KaboomCtx) {
        this.name = name;
        this.initialPosition = initialPosition;
        this.speed = speed;
        this.gameObject = k.make([
            k.sprite("spritesheet", { anim: `${name}-idle-down`}),
            k.area({
              shape: new k.Rect(k.vec2(0, 3), 10, 10),
            }),
            k.body(),
            k.anchor("center"),
            k.pos(initialPosition),
            k.scale(scaleFactor),
            "name"
          ]);
        this.direction = "down";
    }

    startMovement(direction: PlayerDirection) {
        this.direction = direction;
        this.gameObject.play(this.name + '-' + movement[direction].animToPlay);
    }

    stopMovement() {
        this.playIdleAnimation();
    }

    move(direction: PlayerDirection) {
        movement[direction].move(this);
        this.direction = direction;
    }

    playAnimation(animation: string) {
        this.gameObject.play(animation);
    }

    playIdleAnimation() {
        this.gameObject.play(`${this.name}-idle-${this.direction}`);
    }
}
