import EventEmitter from "eventemitter3";

export default class Plant {

  public eventEmitter: EventEmitter = new EventEmitter();
  public type: string = 'Cherry';
  public health: number = 1;

  constructor() {

  }

  public destroy():void {
    console.log('Plant model destroy');
    this.eventEmitter.emit('destroy', this);
  }

}