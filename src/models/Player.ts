import { GameObj } from "kaboom";
import { k } from "../lib/ctx";
import { Position } from "../types";
import { scaleFactor } from "../constants";

export class Player {
  public gameObj: GameObj;
  public id: string;
  public lastAnimationDone: string;

  constructor(id: string, position: Position) {
    this.gameObj = k.add([
      k.anchor("center"),
      k.sprite("spritesheet", { anim: "idle-down" }),
      k.pos(position.x, position.y),
      k.body(),
      k.scale(scaleFactor),
      k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
      }),
    ]);
    this.id = id;
    this.lastAnimationDone = "idle-down";
  }

  playAnimation(nextAnimation: string) {
    // Prevents the same animation from being played again
    if (this.lastAnimationDone === nextAnimation) return;
    this.lastAnimationDone = nextAnimation;
    this.gameObj.play(nextAnimation);
  }
}
