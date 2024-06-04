import { MAX_LISTEN_RANGE } from "../../constants";
import { k } from "../../lib/ctx";
import Character from "../../models/Character";
import * as easystarjs from "easystarjs";
import { calculateDistance } from "../../utils";
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
} from "../../lib/UI";

import * as pnj from "../../characters";
import Game from "../../models/Game";
import EventBus from "../../models/EventBus";
import { listenSpeech } from "../../speech-to-text/listenSpeech";
import { convertCollisionLayerToGrid, setupMap } from "./map";

const easystar = new easystarjs.js();
const player = pnj.paul_martinez;

var characters: Character[] = [];

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

characters.forEach((character) => {
  character.player = player;
});

const onCharacterSpeak = ({
  speaker,
  text,
}: {
  speaker: Character;
  text: string;
}) => {
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
};

const askQuestion = (startListenSpeech = false) => {
  if (startListenSpeech) {
    listenSpeech();
  }
  openUI(onPlayerAskQuestion);
};

export const createMainScene = () => {
  k.scene("main", async () => {
    canvas.focus();

    EventBus.subscribe("character:speak", onCharacterSpeak);

    displayChatButton();

    // Open chat
    canvas.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.code === "Space") && !isUIOpen()) {
        const neighbors = getNearestCharacters();

        if (neighbors.length > 0) {
          askQuestion(e.code === "Space");
        }
      }
    });

    // Close chat with escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isUIOpen()) {
        Game.getInstance().isGamePaused = false;
        canvas.focus();
        closeUI();
      }
    });

    // Open chat with chat button
    chatButton.addEventListener("click", () => askQuestion());
    microButton.addEventListener("click", () => askQuestion(true));

    // Map
    const { mapData } = await setupMap();

    // Pathfinding
    easystar.setGrid(convertCollisionLayerToGrid(mapData));
    easystar.setAcceptableTiles([0]);

    // Add characters to the scene
    for (const character of characters) {
      k.add(character.gameObject);
    }

    // Player can move
    player.setupControls();

    // Frame update
    k.onUpdate(() => {
      if (Game.getInstance().isGamePaused) return;

      // Get neighbors before MAX_LISTEN_RANGE
      const neighbors = getNearestCharacters();

      if (neighbors.length > 0) {
        displayEnableChatButton();
      } else {
        displayDisableChatButton();
      }

      // Camera center on player
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

const getNearestCharacters = () => {
  return characters
    .filter((character) => character !== player)
    .filter(
      (character) =>
        calculateDistance(character.gameObject.pos, player.gameObject.pos) <
        MAX_LISTEN_RANGE
    );
};

function onPlayerAskQuestion(textInput: string) {
  EventBus.publish("character:speak", { speaker: player, text: textInput });
}
