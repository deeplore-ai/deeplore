import { Key } from "kaboom";
import { k } from "../lib/ctx";
import { PlayerDirection } from "../types";

import Character, { CharacterConstructor } from "./Character";
import Game from "./Game";
import InterlocutorCollider from "./InterlocutorCollider";

export class Player extends Character {
  interlocutorCollider: InterlocutorCollider;
  constructor(args: CharacterConstructor) {
    super({...args, tagList: ["player"]});

    this.interlocutorCollider = new InterlocutorCollider(
      args.k,
      args.initialPosition,
    );
  }

  move(direction: PlayerDirection) {
    super.move(direction);
    this.interlocutorCollider.setDirection(direction);
    this.interlocutorCollider.setPosition(this.gameObject.pos);
  }

  public setupControls() {
    const directionKeys = ["up", "down", "left", "right"];
    for (const direction of directionKeys) {
      k.onKeyPress(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        this.startMovement(direction as PlayerDirection);
      });

      k.onKeyDown(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        this.move(direction as PlayerDirection);
      });

      k.onKeyRelease(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        this.stopMovement();
      });
    }
    k.onKeyDown("shift", () => {
      this.speed = 400;
    });
    k.onKeyRelease("shift", () => {
      this.speed = 250;
    });
  }
}
