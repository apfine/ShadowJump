const player = document.getElementById("player");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const levelDisplay = document.getElementById("level");

let isJumping = false;
let velocity = 0;
let gravity = 0.8;
let jumpStrength = -15;
let score = 0;
let highScore = 0;
let level = 1;
let gameStartedAt = Date.now();

const levels = [
  { name: "Neon Skies", speed: 5, background: "bg1.jpg" },
  { name: "Plasma Fields", speed: 6, background: "bg2.jpg" },
  { name: "Quantum Ruins", speed: 7, background: "bg3.jpg" },
];

function updateScore() {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = `High Score: ${highScore}`;
  }
  if (score % 10 === 0) levelUp();
}

function levelUp() {
  level = Math.min(level + 1, levels.length);
  const currentLevel = levels[level - 1];
  levelDisplay.textContent = `Level ${level}: ${currentLevel.name}`;
  game.style.backgroundImage = `url('${currentLevel.background}')`;
}

function jump() {
  if (!isJumping) {
    velocity = jumpStrength;
    isJumping = true;
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

document.addEventListener("touchstart", jump);

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  game.appendChild(obstacle);

  let obstaclePosition = game.offsetWidth;
  const speed = levels[level - 1].speed;

  function moveObstacle() {
    obstaclePosition -= speed;
    obstacle.style.left = obstaclePosition + "px";

    if (obstaclePosition + obstacle.offsetWidth < 0) {
      obstacle.remove();
      updateScore();
    } else {
      checkCollision(obstacle);
      requestAnimationFrame(moveObstacle);
    }
  }

  moveObstacle();
}

function checkCollision(obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (Date.now() - gameStartedAt > 1000) {
    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      handleGameOver();
    }
  }
}

function handleGameOver() {
  alert(`Game Over! Restarting from Level 1...`);
  score = 0;
  level = 1;
  velocity = 0;
  gameStartedAt = Date.now();
  scoreDisplay.textContent = `Score: ${score}`;
  levelDisplay.textContent = `Level ${level}: ${levels[0].name}`;
  game.style.backgroundImage = `url('${levels[0].background}')`;
  document.querySelectorAll(".obstacle").forEach((o) => o.remove());
}

function gameLoop() {
  const playerTop = parseInt(window.getComputedStyle(player).top);
  velocity += gravity;
  player.style.top = Math.min(game.offsetHeight - player.offsetHeight, playerTop + velocity) + "px";

  if (playerTop + velocity >= game.offsetHeight - player.offsetHeight) {
    isJumping = false;
    velocity = 0;
  }

  requestAnimationFrame(gameLoop);
}

setInterval(createObstacle, 1500);
gameLoop();


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
