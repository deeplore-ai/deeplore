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

if (DEV_MODE) {
  k.go("main");
} else {
  k.go("init");
}
