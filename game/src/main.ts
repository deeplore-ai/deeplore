import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/main/mainScene";
import { createInitialScene } from "./scenes/initialScene";
import { createTrainScene } from "./scenes/trainScene";
import { k } from "./lib/ctx";
import settings from "./settings";
import { openai } from "./openai-sdk";

export const DEV_MODE = true;

setupKaboom();
createMainScene();
createInitialScene();
createTrainScene();

// When using OpenAI sdk, uncomment this line
// This will create all the assistants in the database (if they don't exist)

let promise = Promise.resolve();
if (settings.useOpenAiSdk) {
  promise = openai.createAllAssistants();
}

promise.then(() => {
  if (DEV_MODE) {
    k.go("main");
} else {
    k.go("init");
  }
});
