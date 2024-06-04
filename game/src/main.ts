import { k } from "./lib/ctx";

import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/main/mainScene";
import { createInitialScene } from "./scenes/initialScene";
import { createTrainScene } from "./scenes/trainScene";

const DEV_MODE = true;

setupKaboom();
createMainScene();
createInitialScene();
createTrainScene();

if (DEV_MODE) {
  k.go("main");
} else {
  k.go("init");
}
