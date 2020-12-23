import EventEmitter from "eventemitter3";
import Row from "./row";

export default class Zombie {

  public progress: number;
  public parent: Row;
  public eventEmitter: EventEmitter;
  public squareN: number;
  public health: number;

  public static create(): Zombie {
    const zombie = new Zombie();
    zombie.progress = 0;
    zombie.health = 1;
    return zombie;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

}