import EventEmitter from "eventemitter3";
import PlantSpec from "./plant-spec";

export default class Plant {

  public eventEmitter: EventEmitter = new EventEmitter();
  public type: number;
  public health: number = 1;

  public toughness: number;

  constructor() {

  }

  public destroy():void {
    console.log('Plant model destroy');
    this.eventEmitter.emit('destroy', this);
  }

  public static create(spec: PlantSpec): Zombie {
    const plant = new Plant();
    plant.type = spec.type || 0;
    plant.toughness = spec.toughness || 0.5;
    
    return plant;
  }

}