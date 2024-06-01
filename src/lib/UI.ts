const UIElement = document.getElementById("ui");
const input = document.getElementById("question") as HTMLInputElement;
const canvas = document.getElementById("game") as HTMLCanvasElement;

export const openUI = (onEnter: (textInput: string) => void) => {
  if (UIElement === null) return;
  UIElement.style.display = "flex";
  input.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const textInput = input.value;
      input.value = "";

      closeUI();
      input.removeEventListener("keydown", handleKeyDown);
      canvas.focus();
      onEnter(textInput);
    }
  };

  input.addEventListener("keydown", handleKeyDown);
};

export const closeUI = () => {
  if (UIElement === null) return;
  UIElement.style.display = "none";
};
