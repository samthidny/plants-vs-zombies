import EventEmitter from "eventemitter3";
import Square from "./square";
import Zombie from "./zombie";

export default class Row {

  public zombies: Zombie[];
  public squares: Square[];
  public eventEmitter: EventEmitter;

  public static create(numCols: number) {
    const row = new Row();

    for(let i:number = 0; i < numCols; i++) {
      const square = new Square();
      row.squares.push(square);
    }

    return row;
  }

  public addZombie(zombie: Zombie) {
    zombie.parent = this;
    this.zombies.push(zombie);
    this.eventEmitter.emit('add', zombie);
    const row:Row = this;
    zombie.eventEmitter.addListener('remove', (e) => {
      row.removeZombie(zombie);
    });
  }

  public removeZombie(zombie: Zombie) {
    const index = this.zombies.indexOf(zombie);
    if(index == -1) {
      console.log('Zombie not found');
      return;
    }
    this.zombies.splice(index, 1);

    this.eventEmitter.emit('remove', zombie);
  }

  constructor() {
    this.squares = [];
    this.zombies = [];
    this.eventEmitter = new EventEmitter();
  }

}