import Hero from "./Hero.js";
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";
export default class TileMap {
  constructor(tileSize, map, lvl) {
    this.tileSize = tileSize;
    this.yellowDot = new Image();
    this.yellowDot.src = "graphics/yellowDot.png";
    this.pinkDot = new Image();
    this.pinkDot.src = "graphics/pinkDot.png";
    this.map = map;
    this.heroRadius = 16;
    this.wall = new Image();
    this.lvl = lvl;
    this.wall.src = "graphics/wall.png";
    this.powerDot = this.pinkDot;
    this.powerDotAnmationTimerDefault = 30;
    this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
  }

  //1 - wall
  //0 - dots
  //4 - Hero
  //5 - empty space
  //6 - enemy
  //7 - power dot

  draw(ctx) {
    // console.log(this.map.length);
    for (let row = 0; row < this.map.length; row++) {
      // console.log(this.map[row].length);
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawBlank(ctx, column, row, this.tileSize);
        } else if (tile == 7) {
          this.#drawPowerDot(ctx, column, row, this.tileSize);
        } else if (tile == 9) {
          this.#drawFinish(ctx, column, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, column, row, this.tileSize);
        }
      }
    }
  }

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnmationTimer--;
    if (this.powerDotAnmationTimer === 0) {
      this.powerDotAnmationTimer = this.powerDotAnmationTimerDefault;
      if (this.powerDot == this.pinkDot) {
        this.powerDot = this.yellowDot;
      } else {
        this.powerDot = this.pinkDot;
      }
    }
    ctx.drawImage(this.powerDot, column * size, row * size, size, size);
  }

  #drawWall(ctx, column, row, size) {
    ctx.drawImage(this.wall, column * this.tileSize, row * this.tileSize, size, size);
  }

  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  #drawFinish(ctx, column, row, size) {
    ctx.fillStyle = "#b7fdce";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  getHero(velocity, skor) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0;
          return new Hero(column * this.tileSize, row * this.tileSize, this.tileSize, velocity, this, skor);
        }
      }
    }
  }
  // Metode ini memeriksa apakah Hero berada pada garis finish.
  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 6) {
          this.map[row][column] = 0;
          enemies.push(new Enemy(column * this.tileSize, row * this.tileSize, this.tileSize, velocity, this));
        }
      }
    }
    return enemies;
  }

  isHeroOnFinish(Hero) {
    const row = Math.floor(Hero.y / this.tileSize);
    const column = Math.floor(Hero.x / this.tileSize);
    return this.map[row][column] === 9;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }

    if (Number.isInteger(x / this.tileSize) && Number.isInteger(y / this.tileSize)) {
      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
      }
      const tile = this.map[row][column];
      if (tile === 1) {
        return true;
      }
    }
    return false;
  }

  didWin() {
    return this.lvl === 5;
  }

  // #dotsLeft() {
  //   return this.map.flat().filter((tile) => tile === 0).length;
  // }

  eatPowerDot(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      const tile = this.map[row][column];
      if (tile === 7) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }
}
