export default class Level {

  public gridWidth: number = 9;
  public gridHeight: number = 5;
  
  constructor() {
    
  }


  public get rows(): String {
    let rtn = ``;
    for (let y = 0; y < this.gridHeight; y++) {
      rtn += `<div class="row">`;
        for (let x = 0; x < this.gridWidth; x++) {
          rtn += `<div class="tile">${x}</div>`;
        }
      rtn += `<div>`;
    }
    return rtn;
  }

  public get html(): String {
    return `<div class="level-container">
      ${this.rows}
    </div>
    `;
  }



}