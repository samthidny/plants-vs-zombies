import EventEmitter from "eventemitter3";
import Row from "./row";
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
      const row = Row.create(this.numCols)
      this.rows.push(row);
      //row.addZombie(Zombie.create());
    }
  }

}