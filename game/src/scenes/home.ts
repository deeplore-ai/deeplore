import { continueButton, displayContinueButton, displayNewGameButton, hideContinueButton, hideNewGameButton, newGameButton } from "../lib/UI";
import { k } from "../lib/ctx";
import settings from "../settings";

const previousGameId = localStorage.getItem("gameId");

export function createHomeScene() {
  k.scene("home", async () => {
    
    const screenWidth = k.width();
    const screenHeight = k.height();
    const logoScale = 0.4;
    const logoWidth = 1792 * logoScale;
    const logoHeight = 1024 * logoScale;

    k.add([k.sprite("logo"), k.pos(screenWidth / 2 - logoWidth / 2, screenHeight / 2 - logoHeight), k.scale(logoScale)]);

    if (previousGameId) {
      displayContinueButton();
      continueButton.addEventListener("click", () => {
        settings.gameId = previousGameId;
        leaveFor("main");
      });
    }

    displayNewGameButton();
    newGameButton.addEventListener("click", () => {
      localStorage.setItem("gameId", settings.gameId);
      leaveFor("init");
    });

    function leaveFor(scene: string) {
      hideContinueButton();
      hideNewGameButton();
      k.go(scene);
    }
  });
}

