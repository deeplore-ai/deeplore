import { k } from "../lib/ctx";
import { GameObj } from "kaboom";

k.loadSprite("sky", "/sky.png");
k.loadSprite("mountain", "/glacial_mountains.png");
k.loadSprite("cloud3", "/clouds_mg_3.png");
k.loadSprite("cloud2", "/clouds_mg_2.png");
k.loadSprite("cloud1", "/clouds_mg_1.png");
k.loadSprite("lonelyCloud", "/cloud_lonely.png");
k.loadSprite("cloudBg", "/clouds_bg.png");
k.loadSprite("train", "/train.png");

export const createTrainScene = () => {
  k.scene("train", () => {
    const mountainSprite = k.sprite("mountain");
    const skySprite = k.sprite("sky");
    const cloud3Sprite = k.sprite("cloud3");
    const cloud2Sprite = k.sprite("cloud2");
    const cloud1Sprite = k.sprite("cloud1");
    const lonelyCloudSprite = k.sprite("lonelyCloud");
    const cloudBgSprite = k.sprite("cloudBg");
    const trainSprite = k.sprite("train");

    const imageWidth = 384;
    const imageHeight = 216;

    // Calculate scale factor
    const scaleFactorX = k.width() / imageWidth;
    const scaleFactorY = k.height() / imageHeight;

    const sprites = [
      skySprite,
      cloudBgSprite,
      mountainSprite,
      lonelyCloudSprite,
      cloud3Sprite,
      cloud2Sprite,
      cloud1Sprite,
    ];

    const SPEED = 200000; // base speed

    sprites.forEach((sprite, index) => {
      const speed = SPEED / (sprites.length - index); // sprites with lower z-index move slower

      // Add two instances of each sprite
      for (let i = 0; i < 2; i++) {
        k.add([
          sprite,
          k.pos(i * imageWidth * scaleFactorX, 0), // position the second instance to the right of the first
          k.scale(scaleFactorX, scaleFactorY),
          k.z(index),
          {
            update(this: GameObj) {
              this.move(-speed * k.dt(), 0); // move to the left

              // if the sprite is completely off the screen, move it back to the right
              if (this.pos.x <= -imageWidth * scaleFactorX) {
                this.pos.x += imageWidth * scaleFactorX * 2;
              }
            },
          },
        ]);
      }
    });

    const trainWidth = 626;
    const trainHeight = 100;
    const scale = 4;
    const trainSpeed = 50000; // adjust this value to make the train move faster or slower

    k.add([
      trainSprite,
      k.pos(-trainWidth * 5, k.height() - trainHeight * 2),
      k.scale(scale),
      k.z(sprites.length),
      {
        update(this: GameObj) {
          this.move(trainSpeed * k.dt(), 0); // move to the right

          // if the train is completely off the screen, move it back to the left
          if (this.pos.x >= k.width()) {
            k.go("main");
          }
        },
      },
    ]);
  });
};
