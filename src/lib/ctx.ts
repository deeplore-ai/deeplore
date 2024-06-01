import kaboom from "kaboom";

export const k = kaboom({
  global: false,
  touchToMouse: true,
  canvas: document.getElementById("game") as HTMLCanvasElement,
  debug: true,
});
