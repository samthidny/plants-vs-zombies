import Plant from "./plant";
import PlantSpec from "./plant-spec";
import Zombie from "./zombie";
import ZombieSpec from "./zombie-spec";

export default class EntityManager {

  private _zombieSpecs: ZombieSpec[];
  private _plantSpecs: PlantSpec[];
  
  public get numPlants(): int {
    return this._plantSpecs.length;
  }

  constructor() {
    this._zombieSpecs = [];

    // Create zombie specs here for now
    let zombie: ZombieSpec = new ZombieSpec();
    zombie.type = 0;
    zombie.name = 'Normal';
    zombie.speed = 0.6;
    zombie.attack = 0.5;
    this._zombieSpecs.push(zombie);

    zombie = new ZombieSpec();
    zombie.type = 1;
    zombie.name = 'Cone Head';
    zombie.speed = 0.4;
    zombie.attack = 0.9;
    this._zombieSpecs.push(zombie);

    // Plants
    this._plantSpecs = [];

    let plant: PlantSpec = new PlantSpec();
    plant.type = 0;
    plant.name = 'Brick';
    plant.toughness = 0.9;
    this._plantSpecs.push(plant);

    plant = new PlantSpec();
    plant.type = 1;
    plant.name = 'Salad';
    plant.toughness = 0.1;
    this._plantSpecs.push(plant);

    plant = new PlantSpec();
    plant.type = 2;
    plant.name = 'Chilli';
    plant.toughness = 0.8;
    plant.attack = 0.8;
    this._plantSpecs.push(plant);

    plant = new PlantSpec();
    plant.type = 3;
    plant.name = 'Cherry';
    plant.toughness = 0.5;
    this._plantSpecs.push(plant);

  
  }

  public createZombie(type: number): Zombie {
    const zombieSpec: ZombieSpec = this._zombieSpecs[type];
    const zombie: Zombie = Zombie.create(zombieSpec);
    return zombie;
  }


  public createPlant(type: number): Plant {
    const plantSpec: PlantSpec = this._plantSpecs[type];
    const plant: Plant = Plant.create(plantSpec);
    return plant;
  }


}