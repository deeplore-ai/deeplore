import { Key } from "kaboom";
import { scaleFactor } from "../constants";
import { k } from "../lib/ctx";
import { PlayerDirection } from "../types";
import Character from "../models/Character";

const characters = [
  new Character("char1", k.vec2(100, 100), 250, scaleFactor, k),
  new Character("char2", k.vec2(200, 200), 250, scaleFactor, k),
];

export const createMainScene = () => {
  k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json();
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
        characters[0].startMovement(direction as PlayerDirection);
      });

      k.onKeyDown(direction as Key, () => {
        characters[0].move(direction as PlayerDirection);
      });

      k.onKeyRelease(direction as Key, () => {
        characters[0].stopMovement();
      });
    }

    setInterval(() => {
      // Random between speak and move
      if (Math.random() > 0.5) {
        characters[1].startMovement(
          directionKeys[Math.floor(Math.random() * 4)] as PlayerDirection
        );
      } else {
        characters[1].stopMovement();
        characters[1].speak("Hello les reufs");
      }
    }, 1000);

    // Camera
    k.onUpdate(() => {
      k.camPos(
        characters[0].gameObject.worldPos().x,
        characters[0].gameObject.worldPos().y - 100
      );
      characters[1].move(characters[1].direction);
    });
  });
};
