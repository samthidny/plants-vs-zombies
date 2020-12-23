import EventEmitter from "eventemitter3";
import Row from "./row";

export default class Zombie {

  public progress: number;
  public parent: Row;
  public eventEmitter: EventEmitter;

  public static create(): Zombie {
    const zombie = new Zombie();
    // zombie.parent = parent;
    zombie.progress = 0;
    return zombie;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

}