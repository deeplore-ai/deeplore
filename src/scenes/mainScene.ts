import { GameObj, Key } from "kaboom";
import { scaleFactor } from "../constants";
import { k } from "../lib/ctx";
import { PlayerDirection, PlayerMovement } from "../types";

let playerDirectionStack: PlayerDirection[] = [];

export const createMainScene = () => {
  k.scene("main", async () => {
    const mapData = await (await fetch("./map.json")).json();
    const layers = mapData.layers;
    const map = k.add([k.sprite("map"), k.pos(0), k.scale(scaleFactor)]);

    const player = k.make([
      k.sprite("spritesheet", { anim: "idle-down" }),
      k.area({
        shape: new k.Rect(k.vec2(0, 3), 10, 10),
      }),
      k.body(),
      k.anchor("center"),
      k.pos(),
      k.scale(scaleFactor),
      {
        speed: 250,
        direction: "down",
        currentAnimation: "idle-down",
      },
      "player",
    ]);

    const playerPlayAnimation = (animation: string) => {
      player.play(animation);
      player.currentAnimation = animation;
    };

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

      if (layer.name === "spawn") {
        for (const entity of layer.objects) {
          if (entity.name === "player") {
            player.pos = k.vec2(entity.x * scaleFactor, entity.y * scaleFactor);
          }
        }
      }
    });
    k.add(player);

    const movement: {
      [key in PlayerDirection]: PlayerMovement;
    } = {
      up: {
        move: (player: GameObj) => {
          player.move(0, -player.speed);
        },
        animToPlay: "walk-up",
      },
      down: {
        move: (player: GameObj) => {
          player.move(0, player.speed);
        },
        animToPlay: "walk-down",
      },
      left: {
        move: (player: GameObj) => {
          player.move(-player.speed, 0);
        },
        animToPlay: "walk-left",
      },
      right: {
        move: (player: GameObj) => {
          player.move(player.speed, 0);
        },
        animToPlay: "walk-right",
      },
    };

    const playIDLEAnim = (direction: PlayerDirection) => {
      const animationToPlay = `idle-${direction}`;
      playerPlayAnimation(animationToPlay);
    };

    //Player movement

    Object.keys(movement).forEach((key) => {
      const direction = key as PlayerDirection;
      const currentMovement = movement[direction];
      k.onKeyPress(key as Key, () => {
        playerDirectionStack.push(direction);
        player.play(currentMovement.animToPlay);
        player.currentAnimation = currentMovement.animToPlay;
        player.direction = key as PlayerDirection;
      });
      k.onKeyDown(key as Key, () => {
        currentMovement.move(player);
      });

      k.onKeyRelease(key as Key, () => {
        playerDirectionStack = playerDirectionStack.filter(
          (dir) => dir !== direction
        );

        if (playerDirectionStack.length === 0) {
          playIDLEAnim(direction);
        }
      });
    });

    // PLayer spell

    k.onKeyPress("a", () => {
      const animToPlay = `attack-${player.direction}`;
      playerPlayAnimation(animToPlay);

      setTimeout(() => {
        //Si la stack est vide, on joue l'animation idle
        if (playerDirectionStack.length === 0) {
          return playIDLEAnim(player.direction as PlayerDirection);
        }

        const currentPlayerDirection = playerDirectionStack.at(
          -1
        ) as PlayerDirection;
        const newAnimToPlay = movement[currentPlayerDirection].animToPlay;
        playerPlayAnimation(newAnimToPlay);
      }, 200);
    });

    // Camera
    k.onUpdate(() => {
      k.camPos(player.worldPos().x, player.worldPos().y - 100);
    });
  });
};
