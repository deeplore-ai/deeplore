import { Key } from "kaboom";
import { scaleFactor } from "../constants";
import { k } from "../lib/ctx";
import { PlayerDirection } from "../types";
import Character from "../models/Character";
import * as easystarjs from "easystarjs";
import { fromXYToGrid } from "../utils";
import { canvas, chatButton, isUIOpen, openUI } from "../lib/UI";
import type jsonMap from "../../public/map.json";

type Map = typeof jsonMap;

const easystar = new easystarjs.js();
import Game from "../models/Game";

const characters = [
  new Character("char1", k.vec2(1343, 1052), 250, scaleFactor, k),
  new Character("char2", k.vec2(1343, 1100), 250, scaleFactor, k),
  new Character("priest", k.vec2(1250, 1100), 250, scaleFactor, k),
];

export const createMainScene = () => {
  k.scene("main", async () => {
    canvas.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !isUIOpen()) {
        openUI((textInput) => {
          characters[0].speak(textInput);
          characters[2].hear(textInput);
        });
      }
    });

    chatButton.addEventListener("click", () => {
      openUI((textInput) => {
        characters[0].speak(textInput);
      });
    });

    canvas.focus();

    // display chat icon
    chatButton.style.display = "flex";

    const mapData: Map = await (await fetch("./map.json")).json();
    easystar.setGrid(convertCollisionLayerToGrid(mapData));
    easystar.setAcceptableTiles([0]);
    const layers = mapData.layers;
    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    //Collision
    //The collision layer is named as : collisions
    layers.forEach((layer: any) => {
      if (layer.name === "collisions") {
        layer.objects.forEach((collisionArea: any) => {
          map.add([
            k.area({
              shape: new k.Rect(
                k.vec2(0),
                collisionArea.width,
                collisionArea.height
              ),
            }),
            k.body({ isStatic: true }),
            k.pos(collisionArea.x, collisionArea.y),
            collisionArea.name,
          ]);
        });
      }
    });
    for (const character of characters) {
      k.add(character.gameObject);
    }

    //Player movement
    const directionKeys = ["up", "down", "left", "right"];
    for (const direction of directionKeys) {
      k.onKeyPress(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        characters[0].startMovement(direction as PlayerDirection);
      });

      k.onKeyDown(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        characters[0].move(direction as PlayerDirection);
      });

      k.onKeyRelease(direction as Key, () => {
        if (Game.getInstance().isGamePaused) return;
        characters[0].stopMovement();
      });
    }

    setInterval(() => {
      if (Game.getInstance().isGamePaused) return;

      // Random between speak and move
      if (Math.random() > 0.5) {
        characters[2].startMovement(characters[2].direction);
      } else {
        characters[2].stopMovement();
        // characters[1].speak("Hello les reufs");

        /*const LISTEN_RANGE = 300;
        if (playerDistance < LISTEN_RANGE) {
          characters[1].speak("Hello les reufs");
        } else {
          const message = truncateText(
            "Hello les reufs",
            playerDistance - LISTEN_RANGE
          );
          characters[1].speak(message);
        }*/
      }
    }, 1000);

    characters[2].setTarget(characters[0].gameObject.pos);
    recalculatePath(characters[2]);
    /*     openUI((textInput) => {
      characters[0].speak(textInput);
    }); */

    // Camera
    k.onUpdate(() => {
      if (Game.getInstance().isGamePaused) return;
      k.camPos(
        characters[0].gameObject.worldPos().x,
        characters[0].gameObject.worldPos().y - 100
      );
      if (characters[2].isMoving) {
        characters[2].move(characters[2].direction);
        characters[2].setTarget(characters[0].gameObject.pos);
      }
    });
  });
};

function convertCollisionLayerToGrid(map: Map) {
  const flatCollisions: number[] = [];
  for (const layer of map.layers) {
    if (
      layer.name === "tree" ||
      layer.name === "house" ||
      layer.name === "water"
    ) {
      if (!layer.data) continue;
      for (let i = 0; i < layer.data.length; i++) {
        const value = layer.data[i];
        flatCollisions[i] = value > 0 ? 1 : flatCollisions[i] || 0;
      }
    }
  }
  const collisions: number[][] = [];
  for (let i = 0; i < flatCollisions.length; i += map.width) {
    collisions.push(flatCollisions.slice(i, i + map.width));
  }
  return collisions;
}

function fromGridToDirection(
  nextPos: { x: number; y: number },
  charGridPos: { x: number; y: number }
) {
  if (nextPos.x < charGridPos.x) {
    return "left";
  } else if (nextPos.x > charGridPos.x) {
    return "right";
  }
  if (nextPos.y < charGridPos.y) {
    return "up";
  } else if (nextPos.y > charGridPos.y) {
    return "down";
  }
}

function recalculatePath(character: Character) {
  if (!character.target) return;
  const charGridPos = fromXYToGrid(
    character.gameObject.pos.x,
    character.gameObject.pos.y,
    16
  );
  const targetGridPos = fromXYToGrid(
    character.target.x,
    character.target.y,
    16
  );
  easystar.findPath(
    charGridPos.x,
    charGridPos.y,
    targetGridPos.x,
    targetGridPos.y,
    (path: { x: number; y: number }[]) => {
      if (path && path.length > 1) {
        character.direction = fromGridToDirection(
          path[1],
          charGridPos
        ) as PlayerDirection;
      }
      recalculatePath(character);
    }
  );
  easystar.calculate();
}
