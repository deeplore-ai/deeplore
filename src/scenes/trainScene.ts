import { k } from "../lib/ctx";

k.loadSprite("plaine", "/plaine.jpg");

export const createTrainScene = () => {
  k.scene("train", () => {
    const SPEED = 200;
    const BG_WIDTH = 800; // replace with the actual width of your background image

    // Create two background sprites
    const bg1 = k.add([k.sprite("plaine"), k.pos(0, 0), k.scale(1.2)]);
    const bg2 = k.add([k.sprite("plaine"), k.pos(BG_WIDTH, 0), k.scale(1.2)]);

    // Move the background sprites to the left every frame
    k.onUpdate(() => {
      bg1.move(-SPEED * k.dt(), 0);
      if (bg1.pos.x <= -BG_WIDTH) {
        bg1.pos.x += BG_WIDTH * 2;
      }
      bg2.move(-SPEED * k.dt(), 0);
      if (bg2.pos.x <= -BG_WIDTH) {
        bg2.pos.x += BG_WIDTH * 2;
      }
    });
  });
};
