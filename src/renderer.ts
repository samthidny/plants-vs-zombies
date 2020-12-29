import EventEmitter from "eventemitter3";
import Level from "./level";
import Model from "./model";
import Plant from "./plant";
import Row from "./row";
import Square from "./square";
import Zombie from "./zombie";

export default class Renderer {

  public debug: boolean = true;
  private _squareSize: number = 100;
  private _zombieStartX: number;
  private _zombiesToEl:Map<Zombie, HTMLElement>;
  public eventEmitter: EventEmitter;
  
  constructor(private _model: Model) {
    this.eventEmitter = new EventEmitter():
    this._zombieStartX = this._model.numCols * this._squareSize;
    this._zombiesToEl = new Map<Zombie, HTMLElement>();

    this._model.eventEmitter.addListener('plant-added', (square: Square) => {
      console.log('renderer heard model plant-added');
      this.addPlant(square);

    });
  }

  private creatRow(row: Row, rowIndex: number) {
    const el = document.createElement('div');
    el.classList.add('row');
    //el.innerHTML = 'ROW';
    el.style.top = `${rowIndex * this._squareSize}px`;
    // Add squares to row
    row.squares.forEach((square: Square, colIndex: number) => {
      const squareEl = this.createSquare(colIndex);
      squareEl.setAttribute('row', String(rowIndex));
      squareEl.setAttribute('col', String(colIndex));
      
      const n = (rowIndex * this._model.numCols) + colIndex;
      const styles = ['green-light', 'green-med', 'green-dark'];
      let c = 0;
      if (colIndex % 2 === 0) {
        c++;
      }
      if (rowIndex % 2 !== 0) {
        c++;
      }
      squareEl.classList.add('square');
      squareEl.classList.add(styles[c]);
      el.appendChild(squareEl);

    })
    
    
    return el;
  }

  private createSquare(index: number) {
    const el = document.createElement('div');
    el.classList.add('square');
    //el.innerHTML = 'SQUARE';
    el.style.left = `${this._squareSize * index}px`;
    el.style.width = `${this._squareSize}px`;
    el.style.height = `${this._squareSize}px`;
    
    return el;
  }

  private createZombie(zombie: Zombie) {
    const el = document.createElement('div');
    el.classList.add('zombie');
    el.setAttribute('type', zombie.type);
    // el.innerHTML = 'ZOMBIE';
    el.style.left = `${this._squareSize * this._model.numCols}px`;

    el.style.width = `${this._squareSize}px`;
    el.style.height = `${this._squareSize}px`;
    
    this._zombiesToEl.set(zombie, el);

    zombie.eventEmitter.addListener('state-change', (zombie: Zombie, oldState: string) => {
      console.log('Renderer heard Zombie state change ', zombie.state);
      el.classList.remove(oldState);
      if (zombie.state) {
        el.classList.add(zombie.state);
      }
      
    });

    if(this.debug) {
      this.addDebugger(el, zombie);
    }
    return el;
  }

  private removeZombie(zombie: Zombie) {
    const el:HTMLElement = this._zombiesToEl.get(zombie);
    if(el) {
      el.parentElement.removeChild(el);
    }
  }


  private addPlant(square: Square) {
    const el = document.createElement('div');
    el.classList.add('plant');
    el.innerHTML = 'PLANT' + square.plant.type;

    const squareEl:HTMLElement = this.getSquareElement(square);
    squareEl.appendChild(el);

    square.eventEmitter.addListener('destroy', this.removePlantHandler.bind(this));

    return el;
  }

  private removePlantHandler(square:Square): void {
    console.log('renderer destroy plant');
    const squareEl:HTMLElement = this.getSquareElement(square);
    const plantEl: HTMLElement = squareEl.querySelector('.plant');
    squareEl.removeChild(plantEl);
  }

  private getSquareElement(square: Square): HTMLElement {
    return document.querySelector(`.square[row="${square.rowIndex}"][col="${square.colIndex}"]`);
  }


  private addDebugger(el: HTMLElement, zombie: Zombie) {
    const info:HTMLElement = document.createElement('div');
    info.classList.add('debugger');
    info.innerHTML = 'I am a debugger';
    el.appendChild(info);

  }

  private updateDebugger(el: HTMLElement, zombie: Zombie): void {
    const debuggerEl: HTMLElement = el.querySelector('.debugger');
    if (debuggerEl) {
      debuggerEl.innerHTML = '' + parseInt(zombie.health * 100, 10);
    }
  }

  init() {

    const gameContainer = document.querySelector('#game');

    this._model.rows.forEach((row:Row, index: number) => {
      row.eventEmitter.addListener('remove', (zombie: Zombie) => {
        // Remove zombie sprite
        const el = this._zombiesToEl.get(zombie);
        el.parentElement.removeChild(el);
      })
      const rowEl = this.creatRow(row, index);
      gameContainer.appendChild(rowEl);

      // render zombies
      row.zombies.forEach((zombie: Zombie) => {
        const zombieEl = this.createZombie(zombie);
        rowEl.appendChild(zombieEl);
      };

      row.eventEmitter.addListener('add', (zombie: Zombie) => {
        const zombieEl = this.createZombie(zombie);
        rowEl.appendChild(zombieEl);
      })

    });

    gameContainer.querySelectorAll('.square').forEach((square: HTMLElement) => {
      square.addEventListener('click', () => {
        console.log('Square Click!');
        this.eventEmitter.emit('square-click', square.getAttribute('row'), square.getAttribute('col'))
      });
    })
  }

  render(): void {  
    this._model.rows.forEach((row:Row, index: number) => {
      row.zombies.forEach((zombie: Zombie) => {
        const zombieEl = this._zombiesToEl.get(zombie);
        if (zombieEl) {
          //zombieEl.innerHTML = zombie.squareN + '';
          zombieEl.style.left = `${this._zombieStartX - (zombie.progress * this._zombieStartX)}px`;
          // zombieEl.classList.add(zombie.state);
          if (this.debug) {
            this.updateDebugger(zombieEl, zombie);
          }
        }  
      });


      row.squares.forEach((square: Square) => {
        const squareEl:HTMLElement = this.getSquareElement(square);
        if (square.plant) {
          const plant = squareEl.querySelector('.plant');
          plant.innerHTML = `Health ${square.plant.health}`;
        }
        
        // const zombieEl = this._zombiesToEl.get(zombie);
        // if (zombieEl) {
        //   zombieEl.innerHTML = zombie.squareN + '';
        //   zombieEl.style.left = `${this._zombieStartX - (zombie.progress * this._zombieStartX)}px`;  
        // }  
      });

    });
  }

}