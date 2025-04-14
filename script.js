const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreText = document.getElementById('score');
const levelText = document.getElementById('level');

const backgrounds = [
  'url("bg1.jpg")',
  'url("bg2.jpg")',
  'url("bg3.jpg")'
];

let score = 0;
let highScore = 0;
let level = 1;
let isJumping = false;
let isGameOver = false;
let speed = 4;
let playerBottom = 50;
let gravity = 1.5;
let jumpPower = 20;
let isInvincible = false;

function startGame() {
  game.style.backgroundImage = backgrounds[level - 1];
  score = 0;
  isGameOver = false;
  updateScore();

  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', () => jump({ code: 'Space' }));
  generateObstacle();
  generatePowerUp();
  gameLoop();
}

function updateScore() {
  scoreText.textContent = `Score: ${score} | High Score: ${Math.max(score, highScore)}`;
  levelText.textContent = `Level ${level}: ${["Neon Skies", "Plasma Fields", "Galactic Core"][level - 1]}`;
}

function jump(e) {
  if (e.code === 'Space' && !isJumping) {
    isJumping = true;
    let velocity = jumpPower;
    const jumpInterval = setInterval(() => {
      if (velocity <= -jumpPower) {
        clearInterval(jumpInterval);
        isJumping = false;
        return;
      }
      playerBottom += velocity;
      player.style.bottom = `${playerBottom}px`;
      velocity -= gravity;
    }, 20);
  }
}

function generateObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.right = '-60px';
  const obstacleSpeed = 4 - level * 0.8;
  obstacle.style.animationDuration = `${obstacleSpeed}s`;
  game.appendChild(obstacle);

  const obstacleMove = setInterval(() => {
    const obstacleLeft = obstacle.getBoundingClientRect().left;
    const playerBox = player.getBoundingClientRect();

    if (
      !isInvincible &&
      obstacleLeft < playerBox.right &&
      obstacleLeft + 50 > playerBox.left &&
      playerBox.bottom > game.getBoundingClientRect().bottom - 60
    ) {
      clearInterval(obstacleMove);
      gameOver();
    }

    if (obstacleLeft > window.innerWidth + 50) {
      obstacle.remove();
      clearInterval(obstacleMove);
      score++;
      updateScore();
      if (score % 10 === 0 && level < 3) {
        level++;
        game.style.backgroundImage = backgrounds[level - 1];
      }
    }
  }, 20);

  setTimeout(generateObstacle, 2000 + Math.random() * 2000);
}

function generatePowerUp() {
  if (isGameOver) return;

  const powerup = document.createElement('div');
  powerup.classList.add('powerup');
  powerup.style.right = '-60px';
  game.appendChild(powerup);

  const powerMove = setInterval(() => {
    const powerBox = powerup.getBoundingClientRect();
    const playerBox = player.getBoundingClientRect();

    if (
      powerBox.left < playerBox.right &&
      powerBox.right > playerBox.left &&
      powerBox.top < playerBox.bottom &&
      powerBox.bottom > playerBox.top
    ) {
      activatePowerUp();
      powerup.remove();
      clearInterval(powerMove);
    }

    if (powerBox.left > window.innerWidth + 50) {
      powerup.remove();
      clearInterval(powerMove);
    }
  }, 20);

  setTimeout(generatePowerUp, 10000 + Math.random() * 10000);
}

function activatePowerUp() {
  const type = Math.random() > 0.5 ? 'speed' : 'invincible';
  if (type === 'speed') {
    speed /= 2;
    setTimeout(() => speed *= 2, 5000);
  } else {
    isInvincible = true;
    player.style.filter = 'drop-shadow(0 0 12px cyan)';
    setTimeout(() => {
      isInvincible = false;
      player.style.filter = 'drop-shadow(0 0 10px #ff00ff)';
    }, 5000);
  }
}

function gameOver() {
  isGameOver = true;
  highScore = Math.max(highScore, score);
  alert("Game Over! Starting from Level 1");
  location.reload();
}

function gameLoop() {
  if (isGameOver) return;
  requestAnimationFrame(gameLoop);
}

startGame();
