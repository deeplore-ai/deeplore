import { GameObj } from "kaboom";
import type jsonMap from "../../../public/map.json";
import { scaleFactor } from "../../constants";
import { k } from "../../lib/ctx";
import { InteractionType } from "../../types";
import { INTERACTION } from "./interactions";

export type Map = typeof jsonMap;

export const setupMap = async (): Promise<{
  map: GameObj;
  mapData: Map;
}> => {
  const mapData: Map = await (await fetch("./map.json")).json();
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
    } else if (layer.name === "interaction") {
      //create collision with onCollisionEvent
      layer.objects.forEach((collisionArea: any) => {
        const area = k.area({
          shape: new k.Rect(
            k.vec2(0),
            collisionArea.width,
            collisionArea.height
          ),
        });
        const element = map.add([
          area,
          k.body({ isStatic: true }),
          k.pos(collisionArea.x, collisionArea.y),
          collisionArea.name,
        ]);
        const text = INTERACTION[collisionArea.name as InteractionType];

        area.onCollide("Player", () => {
          const textSize = 16;

          const message = k.add([
            k.text(text, {
              size: textSize,
              font: "monospace",
              transform: {
                color: k.rgb(0, 0, 0),
              },
            }),
            k.pos(0, 0), // initial position
            k.z(1),
          ]);

          const backgroundPadding = 12;
          const borderBorderWidth = 4;
          const messageWidth = message.width;
          const messageHeight = message.height;

          const messageX =
            element.worldPos().x +
            borderBorderWidth +
            backgroundPadding +
            32 -
            messageWidth / 2;
          const messageY = element.worldPos().y - 24;

          message.pos.x = messageX;
          message.pos.y = messageY;

          const backgroundBorder = k.add([
            k.rect(
              messageWidth + backgroundPadding * 2 + borderBorderWidth * 2,
              messageHeight + backgroundPadding * 2 + borderBorderWidth * 2,
              { radius: 5 }
            ),

            k.color(0, 0, 0),
            k.pos(
              messageX - backgroundPadding - borderBorderWidth,
              messageY - backgroundPadding - borderBorderWidth
            ),
            k.z(0),
          ]);

          const background = k.add([
            k.rect(
              messageWidth + backgroundPadding * 2,
              messageHeight + backgroundPadding * 2,
              { radius: 5 }
            ),

            k.color(255, 255, 255),
            k.pos(messageX - backgroundPadding, messageY - backgroundPadding),
            k.z(0),
          ]);

          setTimeout(() => {
            k.destroy(background);
            k.destroy(backgroundBorder);
            k.destroy(message);
          }, 2500);
        });
      });
    }
  });

  return {
    map,
    mapData,
  };
};

export const convertCollisionLayerToGrid = (map: Map) => {
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
};
