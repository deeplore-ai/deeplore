import { k } from "./lib/ctx";

import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/mainScene";
import { createInitialScene } from "./scenes/initialScene";

const DEV_MODE = true;

setupKaboom();
createMainScene();
createInitialScene();

if (DEV_MODE) {
  k.go("main");
} else {
  k.go("init");
}
