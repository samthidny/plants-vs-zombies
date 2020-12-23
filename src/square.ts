import EventEmitter from "eventemitter3";
import Plant from "./plant";

export default class Square {

  public squares:Square[];
  public plant: Plant;
  public eventEmitter: EventEmitter;

  constructor(public rowIndex:number, public colIndex:number) {
    this.eventEmitter = new EventEmitter();
  }

  addPlant(plant: Plant): void {
    this.plant = plant;
    this.plant.eventEmitter.addListener('destroy', (plant) => {
      console.log('Square destroy plant ', plant);
      this.plant = null;
      this.eventEmitter.emit('destroy', this);
    })
    this.eventEmitter.emit('plant-added', this);
  }


}