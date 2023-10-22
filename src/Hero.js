import MovingDirection from "./MovingDirection.js";

export default class Hero {
  constructor(x, y, tileSize, velocity, tileMap, skor) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;
    this.score = skor;
    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.heroAnimationTimerDefault = 10;
    this.heroAnimationTimer = null;

    this.HeroRotation = this.Rotation.right;

    this.powerDotActive = false;
    this.powerDotAboutToExpire = false;
    this.timers = [];

    this.madeFirstMove = false;

    document.addEventListener("keydown", this.#keydown);

    this.#loadHeroImage();
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.HeroRotation * 90 * Math.PI) / 180);
    ctx.drawImage(this.HeroImage[this.heroImageIndex], -size, -size, this.tileSize, this.tileSize);

    ctx.restore();
  }

  #loadHeroImage() {
    const HeroImage1 = new Image();
    HeroImage1.src = "graphics/hero/hero1.png";

    const HeroImage2 = new Image();
    HeroImage2.src = "graphics/hero/hero2.png";

    const HeroImage3 = new Image();
    HeroImage3.src = "graphics/hero/hero1.png";

    const HeroImage4 = new Image();
    HeroImage4.src = "graphics/hero/hero2.png";

    this.HeroImage = [HeroImage1, HeroImage2, HeroImage3, HeroImage4];

    this.heroImageIndex = 0;
  }

  #keydown = (event) => {
    //up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down) this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    //down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up) this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    //left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right) this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    //right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left) this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) {
        if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.requestedMovingDirection)) this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection)) {
      this.heroAnimationTimer = null;
      this.heroImageIndex = 1;
      return;
    } else if (this.currentMovingDirection != null && this.heroAnimationTimer == null) {
      this.heroAnimationTimer = this.heroAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.HeroRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.HeroRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.HeroRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.HeroRotation = this.Rotation.right;
        break;
    }
  }

  #animate() {
    if (this.heroAnimationTimer == null) {
      return;
    }
    this.heroAnimationTimer--;
    if (this.heroAnimationTimer == 0) {
      this.heroAnimationTimer = this.heroAnimationTimerDefault;
      this.heroImageIndex++;
      if (this.heroImageIndex == this.HeroImage.length) this.heroImageIndex = 0;
    }
  }

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotActive = true;
      this.powerDotAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
      }, 1000 * 6);

      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(powerDotAboutToExpireTimer);
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.score += 50;
      });
    }
  }
}
