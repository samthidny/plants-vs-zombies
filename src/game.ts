import EntityManager from "./entity-manager";
import Level from "./level";
import Model from "./model";
import Plant from "./plant";
import Renderer from "./renderer";
import Row from "./row";
import Square from "./square";
import Zombie from "./zombie";
import ZombieSpec from "./zombie-spec";

export default class Game {

  private _level: Level;
  private _renderer: Renderer;
  private _model: Model;
  private _zombieSpecs: ZombieSpec[];
  private _endGame: boolean;
  private _entityManager: EntityManager;
  private _currentPlant: Number = 0;
  
  constructor() {
    // TODO make singleton
    this._entityManager = new EntityManager();
    this._model = new Model();
    this._renderer = new Renderer(this._model);
    this._renderer.init();
    this._renderer.eventEmitter.addListener('square-click', (row, col) => {
      console.log('Game square-click ', row, col);
      this.addPlantToModel(row, col, this._currentPlant);
    });

    this._renderer.eventEmitter.addListener('plant-selected', (id) => {
      console.log('Game plant selected ' + id);
      this._currentPlant = id;
    });

    this.startGame();
  }

  public gameLoop() {

    const renderFactor: number = 0.02;
    const speedFactor: number = 0.005;
    
    if(this._endGame) return;

    this._model.rows.forEach((row: Row) => {
      row.zombies.forEach((zombie: Zombie) => {
        
        // Plant detection
        const halfSquare: number = 1 / this._model.numCols * 0.5;
        const squareN: number = this._model.numCols - Math.ceil((zombie.progress - halfSquare) * this._model.numCols);
        zombie.squareN = squareN;
        const zombieSquare: Square = row.squares[squareN];

        // If Zombie is eating a plant
        if(zombieSquare && zombieSquare.plant) {
          zombie.state = 'eating';
          
          const plant:Plant = zombieSquare.plant;

          const plantAttack = (plant.attack + plant.toughness) / 2 * renderFactor;
          const zombieAttack = (zombie.attack + zombie.toughness) / 2 * renderFactor;;
          
          zombie.health -= plantAttack;
          plant.health -= zombieAttack;

          if (zombie.health <= 0) {
            zombie.parent.removeZombie(zombie);
          }
          if (zombieSquare.plant.health <= 0) {
            zombieSquare.plant.destroy();
            zombie.state = '';
          }
        } 
        else {
          if(zombie.state) { 
            zombie.state = '';
          }
          zombie.progress += zombie.speed * speedFactor;
        }

        // Destroy Zombie when reaches end 
        if (zombie.progress >= 1) {
          zombie.parent.removeZombie(zombie);
        }
      });

      if(this.randomAdd() && row.zombies.length < 1) {
        const typeID: number = Math.round(Math.random());
        row.addZombie(this._entityManager.createZombie(typeID));
      }

    });

    this._renderer.render();

    //requestAnimationFrame(this.gameLoop.bind(this));
  }

  private randomAdd(): boolean {
   return Math.random() < 0.05;
  }

  public startGame() {
    setInterval(this.gameLoop.bind(this), 50);
  }

  private addPlantToModel(row, col, plantID): void {
    console.log('Game.addPlant', row, col);
    const square: Square = this._model.rows[row].squares[col];
    if (square.plant) {
      console.log('Square already has a plant');
      return;
    }
    
    //const plantID:number = Math.round(Math.random() * (this._entityManager.numPlants - 1));
    const plant = this._entityManager.createPlant(plantID);
    square.addPlant(plant);
  }

}