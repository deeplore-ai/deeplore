import { k } from "./lib/ctx";

import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/mainScene";
import { createInitialScene } from "./scenes/initialScene";
import { createTrainScene } from "./scenes/trainScene";
import { NPC } from "../gpt-sdk/npc";

const DEV_MODE = true;

setupKaboom();
createMainScene();
createInitialScene();
createTrainScene();

await NPC.createAllAssistants();

if (DEV_MODE) {
  k.go("main");
} else {
  k.go("init");
}
