import TileMap from "./TileMap.js";
import maps from "./Maps.js";
import Enemy from "./Enemy.js";
const tileSize = 32;
const velocity = 2;
const canvas = document.getElementById("gameCanvas");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
let tileMap = new TileMap(tileSize, maps[1], 1);
let hero = tileMap.getHero(velocity, 0);
let lvl = 1;
let skor = 0;
let enemies = tileMap.getEnemies(velocity);
let gameOver = false;
let gameWin = false;
let isGameRunning = true;
function gameLoop() {
  tileMap.draw(ctx);
  hero.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), hero));
  ctx.strokeText(`lvl: ${lvl}`, 50, 50);
  document.getElementById("lvl").innerHTML = `lvl= ${lvl}`;
  document.getElementById("skor").innerHTML = `skor= ${hero.score}`;
  checkGameOver(); // Periksa apakah game over terjadi
  checkGameWin();
  checkfinishWin();

  if (isGameRunning) {
    return;
  }
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
    gameOver = isGameOver(); // Periksa apakah game over terjadi
    if (gameOver) {
      isGameRunning = false;
      drawGameEnd();
      gameOverSound.play();
    }
  }
}

function checkfinishWin() {
  if (!gameWin) {
    // Periksa apakah Pacman berada pada garis finish
    gameWin = tileMap.isHeroOnFinish(hero);

    if (gameWin == true) {
      skor = hero.score;
      lvl++;
      tileMap = new TileMap(tileSize, maps[lvl]);
      hero = tileMap.getHero(velocity, skor);
      enemies = tileMap.getEnemies(velocity);
      gameWin = false;
      // if (lvl === 5) {
      //   gameWin = true;
      //   drawGameEnd();
      // }
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
    // Menampilkan pesan game over
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