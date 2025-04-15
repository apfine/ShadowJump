//DOnt touch the code here from here to variables , you can break the game up . Contact a senior dev
const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreText = document.getElementById('score');
const levelText = document.getElementById('level');


//Vibhhin backgrounds aapke manoranjan ke liye
//alter only on approval from the senior dev
const backgrounds = [
  'url("bg1.jpg")',
  'url("bg2.jpg")',
  'url("bg3.jpg")'
];

//Important gameplay variables
let score = 0;
let highScore = parseInt(sessionStorage.getItem("highScore")) || 0;
let level = 1;
let isJumping = false;
let isGameOver = false;
let gravity = 0.9;
let velocity = 0;
let position = 50;
let jumpStrength = 15;
let isInvincible = false;

//The function handling game start
function startGame() {
  game.style.backgroundImage = backgrounds[level - 1];
  score = 0;
  isGameOver = false;
  updateScore();

  document.addEventListener('keydown', e => { if (e.code === 'Space') jump(); });
  document.addEventListener('touchstart', () => jump());
  generateObstacle();
  generatePowerUp();
  gameLoop();
}

//level and score updater is here
function updateScore() {
  scoreText.textContent = `Score: ${score} | High Score: ${Math.max(score, highScore)}`;
  levelText.textContent = `Level ${level}: ${["Neon Skies", "Plasma Fields", "Galactic Core"][level - 1]}`;
}

//The primary jump function
function jump() {
  if (isJumping || isGameOver) return;
  isJumping = true;
  velocity = jumpStrength;
}

//The obstacle generator - yahi hai samasya ki jad
function generateObstacle() {
  if (isGameOver) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.animationDuration = `${3 - level * 0.5}s`;
  game.appendChild(obstacle);

  const obstacleMove = setInterval(() => {
    const obstacleBox = obstacle.getBoundingClientRect();
    const playerBox = player.getBoundingClientRect();

    if (
      !isInvincible &&
      obstacleBox.left < playerBox.right &&
      obstacleBox.right > playerBox.left &&
      playerBox.bottom > game.getBoundingClientRect().bottom - 60
    ) {
      clearInterval(obstacleMove);
      obstacle.remove();
      gameOver();
    }

    if (obstacleBox.right < 0) {
      clearInterval(obstacleMove);
      obstacle.remove();
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


//kuch shaktiya hamare hero ke liye
function generatePowerUp() {
  if (isGameOver) return;

  const powerup = document.createElement('div');
  powerup.classList.add('powerup');
  powerup.style.animationDuration = `4s`;
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

    if (powerBox.right < 0) {
      powerup.remove();
      clearInterval(powerMove);
    }
  }, 20);

  setTimeout(generatePowerUp, 10000 + Math.random() * 10000);
}

function activatePowerUp() {
  const type = Math.random() > 0.5 ? 'invincible' : 'scoreBoost';
  if (type === 'invincible') {
    isInvincible = true;
    player.style.filter = 'drop-shadow(0 0 12px cyan)';
    setTimeout(() => {
      isInvincible = false;
      player.style.filter = 'none';
    }, 5000);
  } else {
    score += 5;
    updateScore();
  }
}

function gameOver() {
  isGameOver = true;
  highScore = Math.max(highScore, score);
  sessionStorage.setItem("highScore", highScore);
  alert("Game Over! Restarting from Level 1.");
  location.reload();
}

//This is the complete game loop of how the game works 
//CAUTION : Hey jnr dev dont alter until asked .
function gameLoop() {
  if (isGameOver) return;

  if (isJumping) {
    velocity -= gravity;
    position += velocity;

    if (position <= 50) {
      position = 50;
      isJumping = false;
    }
  }

  player.style.bottom = `${position}px`;

  requestAnimationFrame(gameLoop);
}

//Chaliye shuru karte hain :)
startGame();

