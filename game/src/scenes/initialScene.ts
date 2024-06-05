import { GameObj } from "kaboom";
import { k } from "../lib/ctx";
import { displayNextButton, hideNextButton, nextButton } from "../lib/UI";
import { Color } from "../color";

const INTRO_TEXT: string[] = [
  "Paul Martinez, je sais que vous venez de sortie de l'école de police ...",
  "Un meurtre a eu lieu dans un petit village : Rezé-en-Savoie ...",
  "Vous prenez le train de 6h30 pour vous rendre dans les Alpes ...",
  "Une fois là-bas, le paysage est sublime ! ...",
  "Le fromage alléchant mais les autochtones\nne semblent pas tous prêts à collaborer en toute transparence ...",
  "Qui pouvez-vous vraiment croire ?",
];

k.loadSprite("city", "/city.png");

let enterHasBeenPressed = false;
let isWriting = false;
let currentIndexOfText = 0;

const writeText = async (textToDisplay: string, textGameObj: GameObj) => {
  isWriting = true;
  let displayText = "";
  for (const char of textToDisplay) {
    if (!enterHasBeenPressed) {
      await k.wait(0.02);
    }

    displayText += char;
    textGameObj.text = displayText;
  }
  isWriting = false;
};

export const createInitialScene = () => {
  const onClickNextButton = () => {
    hideNextButton();
    k.go("train");
  };

  k.scene("init", async () => {
    k.add([k.sprite("city"), k.pos(-50, -200), k.scale(1.2)]);

    const screenWidth = k.width();
    const screenHeight = k.height();
    const bubbleHeight = 500;
    const bubbleWidth = screenWidth - 160;
    const bubbleY = (screenHeight - bubbleHeight) / 2;
    const bubbleX = 80;

    k.add([
      k.rect(bubbleWidth, bubbleHeight, { radius: 0 }),
      k.pos(bubbleX, bubbleY),
      k.color(255, 255, 255),
    ]);

    k.add([
      k.text("Conor, commissaire à 5h58 du matin:", {
        size: 30,
        transform: {
          color: Color.black,
        },
      }),
      k.pos(100, bubbleY + 25),
    ]);

    // Le texte
    const textGameObj = k.add([
      k.text("", {
        size: 24,
        transform: {
          color: Color.black,
        },
      }),
      k.pos(100, bubbleY + 100),
    ]);
    const pressEnterText = "Appuyer sur 'Entrer' pour passer";
    const pressEnterTextGameObj = k.add([
      k.text(pressEnterText, {
        size: 12,
        transform: {
          color: Color.black,
        },
      }),
      k.pos(0, 0), // initial position
    ]);

    pressEnterTextGameObj.pos.x =
      bubbleX + (bubbleWidth - pressEnterTextGameObj.width) / 2;
    pressEnterTextGameObj.pos.y =
      bubbleY + bubbleHeight - pressEnterTextGameObj.height - 30;

    const handleEnterPress = () => {
      if (currentIndexOfText === INTRO_TEXT.length - 1) return;

      if (isWriting) {
        enterHasBeenPressed = true;
      } else {
        enterHasBeenPressed = false;
        currentIndexOfText++;
        writeText(INTRO_TEXT[currentIndexOfText], textGameObj);
      }

      if (currentIndexOfText === INTRO_TEXT.length - 1) {
        k.destroy(pressEnterTextGameObj);
        displayNextButton();
      }
    };

    k.onKeyPress("enter", handleEnterPress);
    writeText(INTRO_TEXT[currentIndexOfText], textGameObj);

    nextButton.addEventListener("click", onClickNextButton);
  });

  k.onSceneLeave(() => {
    nextButton.removeEventListener("click", onClickNextButton);
  });
};
