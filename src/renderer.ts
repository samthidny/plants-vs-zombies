import Level from "./level";
import Model from "./model";
import Row from "./row";
import Square from "./square";
import Zombie from "./zombie";

export default class Renderer {

  private _squareSize: number = 100;
  private _zombieStartX: number;

  private _zombiesToEl:Map<Zombie, HTMLElement>;
  
  constructor(private _model: Model) {
      this._zombieStartX = this._model.numCols * this._squareSize;
      this._zombiesToEl = new Map<Zombie, HTMLElement>();
  }

  private creatRow(row: Row, rowIndex: number) {
    const el = document.createElement('div');
    el.classList.add('row');
    //el.innerHTML = 'ROW';
    el.style.top = `${rowIndex * this._squareSize}px`;
    // Add squares to row
    row.squares.forEach((square: Square, colIndex: number) => {
      const squareEl = this.createSquare(colIndex);
      const n = (rowIndex * this._model.numCols) + colIndex;
      const styles = ['green-light', 'green-med', 'green-dark'];
      let c = 0;
      if (colIndex % 2 === 0) {
        c++;
      }
      if (rowIndex % 2 !== 0) {
        c++;
      }
      
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
    //el.innerHTML = 'ZOMBIE';
    el.style.left = `${this._squareSize * this._model.numCols}px`;

    el.style.width = `${this._squareSize}px`;
    el.style.height = `${this._squareSize}px`;
    
    this._zombiesToEl.set(zombie, el);

    return el;
  }

  private removeZombie(zombie: Zombie) {
    const el:HTMLElement = this._zombiesToEl.get(zombie);
    if(el) {
      el.parentElement.removeChild(el);
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

  }

  render(): void {  
    this._model.rows.forEach((row:Row, index: number) => {
      row.zombies.forEach((zombie: Zombie) => {
        const zombieEl = this._zombiesToEl.get(zombie);
        if(zombieEl) {
          zombieEl.style.left = `${this._zombieStartX - (zombie.progress * this._zombieStartX)}px`;  
        }
        
      });

    });
  }

}