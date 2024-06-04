import { Key } from "kaboom";
import { k } from "../lib/ctx";
import { PlayerDirection } from "../types";

import Character, { CharacterConstructor } from "./Character";
import Game from "./Game";

export class Player extends Character {
  constructor(args: CharacterConstructor) {
    super(args);
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
  }
}
