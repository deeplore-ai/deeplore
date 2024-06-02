import { AreaComp, GameObj, Key } from "kaboom";
import { MAX_LISTEN_RANGE, scaleFactor } from "../constants";
import { k } from "../lib/ctx";
import { PlayerDirection } from "../types";
import Character from "../models/Character";
import * as easystarjs from "easystarjs";
import { calculateDistance, fromXYToGrid } from "../utils";
import {
  canvas,
  closeUI,
  displayDisableChatButton,
  displayEnableChatButton,
  isUIOpen,
  microButton,
  openUI,
  displayChatButton,
  chatButton,
} from "../lib/UI";
import type jsonMap from "../../public/map.json";
import * as pnj from "../character_const";
// import { listenSpeech } from "../speech-to-text/listenSpeech";

type Map = typeof jsonMap;

const easystar = new easystarjs.js();
import Game from "../models/Game";
import EventBus from "../EventBus";
import { listenSpeech } from "../speech-to-text/listenSpeech";

const TWO_PNJ_MODE = false;
const player = pnj.paul_martinez;

type InteractionType = "tombe" | "porte" | "vase";

var INTERACTION: Record<InteractionType, string> = {
  tombe: "'Ci-gît Jeanne Costa. Ça devait arriver...'",
  porte: "La porte est fermée",
  vase: "Il y a 1kg de coco dans le vase",
};

var characters: Character[] = [];

if (TWO_PNJ_MODE) {
  characters = [player, pnj.emma_dubois, pnj.matthieu_mancini];
} else {
  characters = [
    player,
    pnj.emma_dubois,
    pnj.matthieu_mancini,
    pnj.dieter_hoffman,
    pnj.enzo_muller,
    pnj.farida_wang,
    pnj.ines_dubois,
    pnj.jonathan_chassang,
    pnj.laurent_dubois,
  ];
}

EventBus.subscribe("character:speak", onCharacterSpeak);

function onCharacterSpeak({
  speaker,
  text,
}: {
  speaker: Character;
  text: string;
}) {
  for (const character of characters) {
    if (character === speaker) continue;
    if (character === player) continue;
    if (
      calculateDistance(character.gameObject.pos, speaker.gameObject.pos) >
      MAX_LISTEN_RANGE
    )
      continue;
    character.hear(text, speaker);
  }
}

const askQuestion = (startListenSpeech = false) => {
  if (startListenSpeech) {
    listenSpeech();
  }
  openUI(onPlayerAskQuestion);
};

export const createMainScene = () => {
  k.scene("main", async () => {
    displayChatButton();

    canvas.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.code === "Space") && !isUIOpen()) {
        const neighbors = getNearestCharacters();

        if (neighbors.length > 0) {
          askQuestion(e.code === "Space");
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isUIOpen()) {
        canvas.focus();
        closeUI();
        Game.getInstance().isGamePaused = false;
      }
    });

    chatButton.addEventListener("click", () => askQuestion());
    microButton.addEventListener("click", () => askQuestion(true));

    canvas.focus();

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

    // Camera
    k.onUpdate(() => {
      if (Game.getInstance().isGamePaused) return;

      // Get neighbors before MAX_LISTEN_RANGE
      const neighbors = getNearestCharacters();

      if (neighbors.length > 0) {
        displayEnableChatButton();
      } else {
        displayDisableChatButton();
      }

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

const getNearestCharacters = () => {
  return characters
    .filter((character) => character !== player)
    .filter(
      (character) =>
        calculateDistance(character.gameObject.pos, player.gameObject.pos) <
        MAX_LISTEN_RANGE
    );
};

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

const recalculatePath = (character: Character) => {
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
};

function onPlayerAskQuestion(textInput: string) {
  EventBus.publish("character:speak", { speaker: player, text: textInput });
}
