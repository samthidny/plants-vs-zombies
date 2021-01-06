import EventEmitter from "eventemitter3";
import Row from "./row";
import ZombieSpec from "./zombie-spec";

export default class Zombie {

  public parent: Row;
  public eventEmitter: EventEmitter;
  public squareN: number;
  private _state: string;
  public type: number;
  public health: number;
  public progress: number;

  public speed: number;
  public attack: number;

  public set state(value: string) {
    const oldState:string = this._state;
    this._state = value;
    this.eventEmitter.emit('state-change', this, oldState);
  }

  public get state() {
    return this._state;
  }

  public static create(spec: ZombieSpec): Zombie {
    const zombie = new Zombie();
    zombie.type = spec.type || 0;
    zombie.progress = 0;
    zombie.health = 1;
    zombie.speed = spec.speed || 1;
    zombie.attack = spec.attack || 1;
    
    return zombie;
  }

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

}