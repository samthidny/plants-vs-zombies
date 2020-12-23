import EventEmitter from "eventemitter3";
import Row from "./row";
import Square from "./square";
import Zombie from "./zombie";

export default class Model {

  public numCols:number = 9;
  public numRows:number = 5;
  public eventEmitter: EventEmitter;

  public rows: Row[];
  
  constructor() {
    this.eventEmitter = new EventEmitter();
    this.rows = [];
    for(let i = 0; i < this.numRows; i++) {
      const row = Row.create(this.numCols, i);
      row.eventEmitter.addListener('plant-added', (square: Square) => {
        console.log('model plant added ', square);
        this.eventEmitter.emit('plant-added', square);
      })
      this.rows.push(row);
    }
  }

}