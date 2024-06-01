import Game from "../models/Game";

const UIElement = document.getElementById("ui");
const input = document.getElementById("question") as HTMLInputElement;
export const canvas = document.getElementById("game") as HTMLCanvasElement;

export const openUI = (onEnter: (textInput: string) => void) => {
  if (UIElement === null) return;
  Game.getInstance().isGamePaused = true;
  UIElement.style.display = "flex";
  input.focus();

  const exit = () => {
    closeUI();
    input.removeEventListener("keydown", handleKeyDown);
    canvas.focus();
    Game.getInstance().isGamePaused = false;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const textInput = input.value;
      input.value = "";
      if (textInput === "") return exit();
      onEnter(textInput);
      exit();
    }
  };

  input.addEventListener("keydown", handleKeyDown);
};

export const closeUI = () => {
  if (UIElement === null) return;
  UIElement.style.display = "none";
};

export const isUIOpen = () => {
  if (UIElement === null) return false;
  return UIElement.style.display === "flex";
};
