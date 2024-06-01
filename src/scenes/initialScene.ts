import { k } from "../lib/ctx";
import { nextButton } from "../lib/UI";

const INTRO_TEXT =
  "Vous êtes Paul Martinez, un jeune enquêteur parisien\nà peine sorti de l’école de police.\nÀ 5h58 du matin, votre commissaire vous appelle. \nUn meurtre a eu lieu dans un petit village : Rezé-en-Savoie.\nVous prenez le train de 6h30 pour vous rendre dans les Alpes\net mener la première enquête de votre carrière.\nUne fois là-bas, le paysage est sublime, le fromage alléchant \nmais les autochtones ne semblent pas tous prêts à collaborer en toute transparence.\nQui pouvez-vous vraiment croire ?";

export const createInitialScene = () => {
  k.scene("init", async () => {
    // black background
    k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

    // write with write effect
    let displayText = "";
    let textHasBeenDisplayed = false;

    const text = k.add([
      k.text(displayText, {
        size: 24,
      }),
      k.pos(100, 100),
    ]);

    const quitScene = () => {
      nextButton.style.display = "none";
      k.go("main");
    };

    let pressedEnter = false;

    k.onKeyPress("enter", () => {
      if (textHasBeenDisplayed) {
        quitScene();
      } else {
        pressedEnter = true;
      }
    });

    for (let i = 0; i < INTRO_TEXT.length; i++) {
      if (!pressedEnter) {
        await k.wait(0.01); // wait for 0.1 seconds
      }
      displayText += INTRO_TEXT[i];
      text.text = displayText;
    }

    nextButton.addEventListener("click", quitScene);

    textHasBeenDisplayed = true;
    nextButton.style.display = "flex";
  });
};
