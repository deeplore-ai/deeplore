import { GameObj } from "kaboom";
import { k } from "../lib/ctx";
import { displayNextButton, hideNextButton, nextButton } from "../lib/UI";

const INTRO_TEXT: string[] = [
  "Paul Martinez, je sais que vous venez de sortie de l'école de police ...",
  "Un meurtre a eu lieu dans un petit village : Rezé-en-Savoie ...",
  "Vous prenez le train de 6h30 pour vous rendre dans les Alpes ...",
  "Une fois là-bas, le paysage est sublime ! ...",
  "Le fromage alléchant mais les autochtones\nne semblent pas tous prêts à collaborer en toute transparence ...",
  "Qui pouvez-vous vraiment croire ?",
];

k.loadSprite("city", "/city.png");
var enterHasBeenPressed = false;
var isWriting = false;
var currentIndexOfText = 0;

const writeText = async (textToDisplay: string, textGameObj: GameObj) => {
  isWriting = true;
  let displayText = "";
  for (let i = 0; i < textToDisplay.length; i++) {
    if (!enterHasBeenPressed) {
      await k.wait(0.02);
    }
    displayText += textToDisplay[i];
    textGameObj.text = displayText;
  }

  isWriting = false;
};

export const createInitialScene = () => {
  k.scene("init", async () => {
    // City background
    k.add([k.sprite("city"), k.pos(-50, -200), k.scale(1.2)]);

    const screenWith = k.width();
    const screenHeight = k.height();

    // Create a bubble for the text

    const bubblePadding = 80;
    const bubbleHeight = 500;
    const bubbleY = (screenHeight - bubbleHeight) / 2;
    // k.add([
    //   k.rect(screenWith - bubblePadding * 2 + 4, bubbleHeight + 4, {
    //     radius: 0,
    //   }),
    //   k.pos(bubblePadding, bubbleY),
    //   k.color(255, 255, 255),
    // ]);

    k.add([
      k.rect(screenWith - bubblePadding * 2, bubbleHeight, {
        radius: 0,
      }),
      k.pos(bubblePadding, bubbleY),
      k.color(255, 255, 255),
    ]);

    // Nom du commissaire
    k.add([
      k.text("Conor, commissaire à 5h58 du matin:", {
        size: 30,
        transform: {
          color: k.rgb(0, 0, 0),
        },
      }),
      k.pos(100, bubbleY + 25),
    ]);

    // Le texte
    const text = k.add([
      k.text("", {
        size: 24,
        transform: {
          color: k.rgb(0, 0, 0),
        },
      }),
      k.pos(100, bubbleY + 100),
    ]);
    const pressEnterText = "Appuyer sur 'Entrer' pour passer";
    const pressEnterTextText = k.add([
      k.text(pressEnterText, {
        size: 12,
        transform: {
          color: k.rgb(0, 0, 0),
        },
      }),
      k.pos(screenWith / 2 - 150, bubbleHeight + 200),
    ]);

    k.onKeyPress("enter", () => {
      // Si on repress enter alors qu'on est à la fin on sort
      if (currentIndexOfText === INTRO_TEXT.length - 1) return;

      // Si writeText est en cours on set enterHasBeenPressed à true, pour que la boucle
      // se coupe toute seule
      if (isWriting) {
        enterHasBeenPressed = true;
      } else {
        // Sinon on incrémente l'index du texte et on lance l'écriture
        enterHasBeenPressed = false;
        currentIndexOfText++;
        writeText(INTRO_TEXT[currentIndexOfText], text);
      }

      // Si on est à la fin on affiche le bouton next
      if (currentIndexOfText === INTRO_TEXT.length - 1) {
        k.destroy(pressEnterTextText);
        displayNextButton();
      }
    });

    // On lance l'écriture du premier texte
    writeText(INTRO_TEXT[currentIndexOfText], text);

    nextButton.addEventListener("click", () => {
      hideNextButton();
      k.go("train");
    });
  });
};
