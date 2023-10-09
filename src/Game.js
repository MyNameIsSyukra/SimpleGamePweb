import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const hero = tileMap.getHero(velocity);
const enemies = tileMap.getEnemies(velocity);
let gameOver = false;
let gameWin = false;
let lvl = 1;
let flag = [false, false, false];

function gameLoop() {
  tileMap.draw(ctx);
  drawGameEnd();
  hero.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), hero));
  checkGameOver();
  checkGameWin();
  checkfinishWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}
function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}
function checkfinishWin() {
  if (!gameWin) {
    // Periksa apakah Pacman berada pada garis finish
    gameWin = tileMap.isHeroOnFinish(hero);

    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some((enemy) => !hero.powerDotActive && enemy.collideWith(hero));
}

function pause() {
  return !hero.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = " You Escaped!";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 2.5, canvas.width, 80);

    ctx.font = "75px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);
