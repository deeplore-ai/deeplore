export default class Game {
  private static instance: Game;

  isGamePaused = false;

  private constructor() {}

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }
}
