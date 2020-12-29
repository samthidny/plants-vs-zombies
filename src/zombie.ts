import EventEmitter from "eventemitter3";
import Row from "./row";

export default class Zombie {

  public parent: Row;
  public eventEmitter: EventEmitter;
  public squareN: number;
  private _state: string;
  public type: number;
  public health: number;
  public progress: number;
  public speed: number;

  public set state(value: string) {
    const oldState:string = this._state;
    this._state = value;
    this.eventEmitter.emit('state-change', this, oldState);
  }

  public get state() {
    return this._state;
  }

  public static create(): Zombie {
    const zombie = new Zombie();
    zombie.type = Math.floor(Math.random() * 2);
    zombie.progress = 0;
    zombie.health = 1;
    zombie.speed = 1;
    return zombie;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

}