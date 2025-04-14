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
let highScore = sessionStorage.getItem('highScore') || 0;
let level = 1;
let isJumping = false;
let isGameOver = false;
let speed = 4;
let gravity = 1;
let jumpPower = 28;
let playerBottom = 50;
let velocity = 0;
let isInvincible = false;
const groundLevel = 50;

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
  if (e.code === 'Space' && !isJumping && playerBottom <= groundLevel + 5) {
    isJumping = true;
    velocity = jumpPower;
  }
}

function applyGravity() {
  if (isJumping || playerBottom > groundLevel) {
    playerBottom += velocity;
    velocity -= gravity;

    if (playerBottom < groundLevel) {
      playerBottom = groundLevel;
      isJumping = false;
      velocity = 0;
    }

    if (playerBottom > 300) {
      playerBottom = 300;
      velocity = -gravity;
    }

    player.style.bottom = `${playerBottom}px`;
  }
}

function generateObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');

  // Random SVG obstacle (3 types)
  const type = Math.floor(Math.random() * 3);
  const svgs = [
    `<svg viewBox="0 0 64 64"><rect x="10" y="10" width="44" height="44" fill="#ff0000"/></svg>`,
    `<svg viewBox="0 0 64 64"><polygon points="32,0 64,64 0,64" fill="#00ff00"/></svg>`,
    `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="#ffff00"/></svg>`
  ];

  obstacle.innerHTML = svgs[type];
  obstacle.style.right = '-60px';
  const obstacleSpeed = 4 - level * 0.5;
  obstacle.style.animationDuration = `${obstacleSpeed}s`;
  game.appendChild(obstacle);

  const move = setInterval(() => {
    const buffer = 10;
    const obsBox = obstacle.getBoundingClientRect();
    const playerBox = player.getBoundingClientRect();
    const gameBox = game.getBoundingClientRect();

    const oLeft = obsBox.left + buffer;
    const oRight = obsBox.right - buffer;
    const pLeft = playerBox.left + buffer;
    const pRight = playerBox.right - buffer;
    const pBottomTouching = playerBox.bottom >= gameBox.bottom - 60;

    if (
      !isInvincible &&
      oLeft < pRight &&
      oRight > pLeft &&
      pBottomTouching
    ) {
      clearInterval(move);
      gameOver();
    }

    if (obsBox.left < -60) {
      obstacle.remove();
      clearInterval(move);
      score++;
      updateScore();

      if (score % 10 === 0 && level < 3) {
        level++;
        game.style.backgroundImage = backgrounds[level - 1];
      }
    }
  }, 20);

  const baseDelay = level === 1 ? 2000 : level === 2 ? 1500 : 1200;
  setTimeout(generateObstacle, baseDelay + Math.random() * 2000);
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

    if (powerBox.left < -60) {
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
  sessionStorage.setItem('highScore', highScore);
  alert("Game Over! Restarting from Level 1...");
  location.reload();
}

function gameLoop() {
  if (isGameOver) return;
  applyGravity();
  requestAnimationFrame(gameLoop);
}

startGame();
