import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/main/mainScene";
import { createInitialScene } from "./scenes/initialScene";
import { createTrainScene } from "./scenes/trainScene";
import { k } from "./lib/ctx";

export const DEV_MODE = true;

setupKaboom();
createMainScene();
createInitialScene();
createTrainScene();

// When using OpenAI sdk, uncomment this line
// This will create all the assistants in the database (if they don't exist)
// await NPC.createAllAssistants();

if (DEV_MODE) {
  k.go("main");
} else {
  k.go("init");
}
