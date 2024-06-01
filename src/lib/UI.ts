import Game from "../models/Game";
import { speechObserver } from "../observables/speechObserver";

const UIElement = document.getElementById("ui");
const input = document.getElementById("question") as HTMLInputElement;
export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const debug = document.getElementById("debug") as HTMLSpanElement;
export const pauseScreen = document.getElementById(
  "pause-overlay"
) as HTMLDivElement;
export const chatButton = document.getElementById("chat") as HTMLButtonElement;
export const nextButton = document.getElementById("next") as HTMLButtonElement;
export const nextDescription = document.getElementById(
  "next-description"
) as HTMLSpanElement;

export const openUI = (onEnter: (textInput: string) => void) => {
  if (UIElement === null) return;
  Game.getInstance().isGamePaused = true;
  UIElement.style.display = "flex";
  pauseScreen.style.display = "flex";
  input.focus();

  const onTranscript = (transcript: string) => {
    let cleaned = transcript.trim();
    if (input.value === "") {
      cleaned = cleaned[0].toUpperCase() + cleaned.slice(1);
    }
    cleaned = cleaned
      .replace("(\\W|^)emma du bois(\\W|$)", "$1Emma Dubois$2")
      .replace("(\\W|^)emma du dubois(\\W|$)", "$1Emma Dubois$2")
      .replace("(\\W|^)emma(\\W|$)", "$1Emma$2");
    input.value += transcript;
  };

  speechObserver.on("speech", onTranscript);

  const exit = () => {
    closeUI();
    speechObserver.off("speech", onTranscript);
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
  pauseScreen.style.display = "none";
};

export const isUIOpen = () => {
  if (UIElement === null) return false;
  return UIElement.style.display === "flex";
};

export const displayNextButton = () => {
  nextButton.style.display = "flex";
};

export const hideNextButton = () => {
  nextButton.style.display = "none";
};
