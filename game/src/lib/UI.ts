import Game from "../models/Game";
import { speechObserver } from "../observables/speechObserver";
import { stopMediaRecorder } from "../speech-to-text/listenSpeech";

const UIElement = document.getElementById("ui");
const input = document.getElementById("question") as HTMLInputElement;
export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const debug = document.getElementById("debug") as HTMLSpanElement;
export const pauseScreen = document.getElementById(
  "pause-overlay"
) as HTMLDivElement;
export const microButton = document.getElementById(
  "micro"
) as HTMLButtonElement;
export const chatButton = document.getElementById("chat") as HTMLButtonElement;
export const musicButton = document.getElementById("music") as HTMLButtonElement;
export const newGameButton = document.getElementById("newgame") as HTMLButtonElement;
export const continueButton = document.getElementById("continue") as HTMLButtonElement;

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
    } else {
      cleaned = " " + cleaned;
    }
    cleaned = cleaned
      .replace(/(\W|^)mathieu manchini(\W|$)/gi, "$1Matthieu Mancini$2")
      .replace(/(\W|^)matthieu manchini(\W|$)/gi, "$1Matthieu Mancini$2")
      .replace(/(\W|^)manchini(\W|$)/gi, "$Mancini$2")
      .replace(/(\W|^)emma du bois(\W|$)/gi, "$1Emma Dubois$2")
      .replace(/(\W|^)emma du bois(\W|$)/gi, "$1Emma Dubois$2")
      .replace(/(\W|^)emma du dubois(\W|$)/gi, "$1Emma Dubois$2")
      .replace(/(\W|^)emma(\W|$)/gi, "$1Emma$2");
    input.value += cleaned;
  };

  speechObserver.on("speech", onTranscript);

  const exit = () => {
    closeUI();
    speechObserver.off("speech", onTranscript);
    stopMediaRecorder();
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
  stopMediaRecorder();
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

export const displayChatButton = () => {
  chatButton.style.display = "flex";
  microButton.style.display = "flex";
};

export const displayEnableChatButton = () => {
  chatButton.disabled = false;
  microButton.disabled = false;
};

export const displayDisableChatButton = () => {
  chatButton.disabled = true;
  microButton.disabled = true;
};

export const hideChatButton = () => {
  chatButton.style.display = "none";
  microButton.style.display = "none";
};

export const displayNewGameButton = () => {
  newGameButton.style.display = "flex";
};

export const hideNewGameButton = () => {
  newGameButton.style.display = "none";
};

export const displayContinueButton = () => {
  continueButton.style.display = "flex";
};

export const hideContinueButton = () => {
  continueButton.style.display = "none";
};

