import { k } from "./lib/ctx";

import { setupKaboom } from "./utils";
import { createMainScene } from "./scenes/mainScene";

setupKaboom();
createMainScene();

k.go("main");
