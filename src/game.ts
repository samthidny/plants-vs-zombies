import Level from "./level";
import Model from "./model";
import Renderer from "./renderer";
import Row from "./row";
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
    this.startGame();
  }

  public gameLoop() {

    if(this._endGame) return;

    const removeZombies: Zombie[] = [];

    this._model.rows.forEach((row: Row) => {
      row.zombies.forEach((zombie: Zombie) => {
        zombie.progress += 0.005;
        // Destroy Zombie when reaches end
        if (zombie.progress >= 1) {
          zombie.parent.removeZombie(zombie);
        }
      });

      if(this.randomAdd()) {
        row.addZombie(Zombie.create());
      }

    });

    this._renderer.render();
  }

  private randomAdd(): boolean {
   return Math.random() < 0.05;
  }

  public startGame() {
    setInterval(this.gameLoop.bind(this), 200);
  }


}