import Level from "./level";
import Model from "./model";
import Plant from "./plant";
import Renderer from "./renderer";
import Row from "./row";
import Square from "./square";
import Zombie from "./zombie";

export default class Game {

  private _level: Level;
  private _renderer: Renderer;
  private _model: Model;

  private _endGame: boolean;
  
  constructor() {
    this._model = new Model();
    this._renderer = new Renderer(this._model);
    this._renderer.init();
    this._renderer.eventEmitter.addListener('square-click', (row, col) => {
      console.log('Game square-click ', row, col);
      this.addPlantToModel(row, col);
    })

    // this._model.eventEmitter.addListener('plant-added', (square: Square) => {
    //   console.log('Game heard model plant-added', square);
    // })

    this.startGame();
  }

  public gameLoop() {

    if(this._endGame) return;

    this._model.rows.forEach((row: Row) => {
      row.zombies.forEach((zombie: Zombie) => {
        

        // Plant detection
        const halfSquare: number = 1 / this._model.numCols * 0.5;
        const squareN: number = this._model.numCols - Math.ceil((zombie.progress - halfSquare) * this._model.numCols);
        zombie.squareN = squareN;
        const zombieSquare: Square = row.squares[squareN];

        if(zombieSquare && zombieSquare.plant) {
          zombieSquare.plant.health -= 0.02;
          zombie.health -= 0.03;
          if(zombie.health <= 0) {
            zombie.parent.removeZombie(zombie);
          }
          if (zombieSquare.plant.health <= 0) {
            zombieSquare.plant.destroy();
          }
        } 
        else {
          zombie.progress += 0.001;
        }

        // Destroy Zombie when reaches end
        if (zombie.progress >= 1) {
          zombie.parent.removeZombie(zombie);
        }
      });

      if(this.randomAdd() && row.zombies.length < 1) {
        row.addZombie(Zombie.create());
      }

    });

    this._renderer.render();

    //requestAnimationFrame(this.gameLoop.bind(this));
  }

  private randomAdd(): boolean {
   return Math.random() < 0.05;
  }

  public startGame() {
    //this.gameLoop();
    setInterval(this.gameLoop.bind(this), 100);
  }

  private addPlantToModel(row, col): void {
    console.log('Game.addPlant', row, col);
    const plant = new Plant();
    this._model.rows[row].squares[col].addPlant(plant);
  }

}