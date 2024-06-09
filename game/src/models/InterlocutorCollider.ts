import { GameObj, KaboomCtx, Vec2 } from "kaboom";
import { START_TRUNCATED_RANGE } from "../constants";
import { PlayerDirection } from "../types";
import { calculateDistance } from "../utils";

const verticalDirection = [1, START_TRUNCATED_RANGE];
const horizontalDirection = [START_TRUNCATED_RANGE, 1];

export default class InterlocutorCollider {
  gameObject: GameObj;
  interlocutor: GameObj | null = null;
  private k: KaboomCtx;
  
  constructor(k: KaboomCtx, initialPos: Vec2){
    this.k = k;
    this.gameObject = k.make([
      k.rect(0,0),
      k.area({
        shape: new k.Rect(k.vec2(0, 0), verticalDirection[0], verticalDirection[1]),
      }),
      k.pos(initialPos),
      "interlocutorCollider"
    ])

    this.gameObject.onCollide("npc", (collider: GameObj) => {
      if (!this.interlocutor) {
        this.interlocutor = collider;
        return;
      }
      if (this.interlocutor === collider) {
        return;
      }
      if (this.isColliderNearerThanInterlocutor(collider)) {
        this.interlocutor = collider;
      }
    })

    this.gameObject.onUpdate(() => {
      if (this.interlocutor && !this.gameObject.isColliding(this.interlocutor)) {
        this.interlocutor = null;
      }
    })
  }

  isColliderNearerThanInterlocutor(collider: GameObj) {
    return this.interlocutor && calculateDistance(this.gameObject.pos, collider.pos) < calculateDistance(this.gameObject.pos, this.interlocutor.pos);
  }

  setPosition(position: Vec2){
    this.gameObject.pos = position;
  }

  setDirection(direction: PlayerDirection){
    switch(direction){
      case "down":
        this.gameObject.area.shape.height = verticalDirection[1];
        this.gameObject.area.shape.width = verticalDirection[0];
        this.gameObject.area.shape.pos = new this.k.Vec2(0, 0);
        break;
      case "up":
        this.gameObject.area.shape.height = verticalDirection[1];
        this.gameObject.area.shape.width = verticalDirection[0];
        this.gameObject.area.shape.pos = new this.k.Vec2(0, -verticalDirection[1]);
        break;
      case "left":
        this.gameObject.area.shape.height = horizontalDirection[1];
        this.gameObject.area.shape.width = horizontalDirection[0];
        this.gameObject.area.shape.pos = new this.k.Vec2(-horizontalDirection[0], 0);
        break;
      case "right":
        this.gameObject.area.shape.height = horizontalDirection[1];
        this.gameObject.area.shape.width = horizontalDirection[0];
        this.gameObject.area.shape.pos = new this.k.Vec2(0, 0);
        break;
    }
  }
}

