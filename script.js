const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const healthElement = document.getElementById("health");
const reloadButton = document.getElementById("reload-btn");

canvas.width = 800;
canvas.height = 600;

let score = 0;
let level = 1;
let health = 100;
let bullets = 10;

let gameOver = false;

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  health: 100,
};

let zombies = [];
let bulletsArray = [];

const zombieSpeed = 1 + level * 0.1;

function createZombie() {
  let x = Math.random() * canvas.width;
  let y = -50;
  zombies.push({ x, y, width: 50, height: 50 });
}

function createBullet() {
  if (bullets > 0) {
    let bullet = {
      x: player.x + player.width / 2 - 5,
      y: player.y - 10,
      width: 5,
      height: 10,
      speed: 7,
    };
    bulletsArray.push(bullet);
    bullets--;
  }
}

function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawZombies() {
  ctx.fillStyle = "red";
  zombies.forEach(zombie => {
    ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);
  });
}

function drawBullets() {
  ctx.fillStyle = "white";
  bulletsArray.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function updateZombies() {
  zombies.forEach(zombie => {
    zombie.y += zombieSpeed;
    if (zombie.y > canvas.height) {
      zombie.y = -50;
      zombie.x = Math.random() * canvas.width;
      health -= 10;
    }
  });
}

function updateBullets() {
  bulletsArray.forEach(bullet => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) {
      bulletsArray.splice(bulletsArray.indexOf(bullet), 1);
    }
  });
}

function checkCollisions() {
  zombies.forEach((zombie, zombieIndex) => {
    bulletsArray.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < zombie.x + zombie.width &&
        bullet.x + bullet.width > zombie.x &&
        bullet.y < zombie.y + zombie.height &&
        bullet.y + bullet.height > zombie.y
      ) {
        score += 10;
        zombies.splice(zombieIndex, 1);
        bulletsArray.splice(bulletIndex, 1);
      }
    });

    if (
      zombie.x < player.x + player.width &&
      zombie.x + zombie.width > player.x &&
      zombie.y < player.y + player.height &&
      zombie.y + zombie.height > player.y
    ) {
      health -= 20;
      zombies.splice(zombieIndex, 1);
    }
  });
}

function gameLoop() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 80, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawZombies();
  drawBullets();

  updateZombies();
  updateBullets();
  checkCollisions();

  scoreElement.textContent = `Score: ${score}`;
  levelElement.textContent = `Level: ${level}`;
  healthElement.textContent = `Health: ${health}`;

  if (score >= 50) {
    level++;
    zombies.push({ x: Math.random() * canvas.width, y: -50, width: 50, height: 50 });
    score = 0;
  }

  if (health <= 0) {
    gameOver = true;
  }

  requestAnimationFrame(gameLoop);
}

function movePlayer(e) {
  if (e.key === "ArrowLeft" && player.x > 0) {
    player.x -= player.speed;
  }
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
  if (e.key === "ArrowUp" && player.y > 0) {
    player.y -= player.speed;
  }
  if (e.key === "ArrowDown" && player.y + player.height < canvas.height) {
    player.y += player.speed;
  }
}

function reload() {
  if (bullets < 10) {
    bullets = 10;
  }
}

document.addEventListener("keydown", movePlayer);
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    createBullet();
  }
});
reloadButton.addEventListener("click", reload);

setInterval(createZombie, 2000);
gameLoop();
