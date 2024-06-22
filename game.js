window.onload = () => {
  const player = document.getElementById('player');
  const player2 = document.getElementById('player2');
  const gameContainer = document.querySelector('.game-container');
  const restartButton = document.getElementById('restart-button');
  const scoreDisplay = document.getElementById('score');

  let playerX = window.innerWidth / 2 - player.offsetWidth / 2;
  const playerSpeed = 20;
  let player2X = window.innerWidth / 2 - player2.offsetWidth / 2;
  const player2Speed = 20;
  
  const projectiles = [];
  const bullets = [];
  const targets = [];

  let score = 0;
  let gameOver = false;

  // Initialize player positions
  player.style.left = `${playerX}px`;
  player2.style.left = `${player2X}px`;

  let lastPlayerShotTime = 0;
  let lastPlayer2ShotTime = 0;
  const regularShootCooldown = 1000; // 300 milliseconds = 0.3 seconds
  const specialShootCooldown = 5000; // 5000 milliseconds = 5 seconds

  // Handle player movement and shooting
  document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    if (event.key === 'ArrowLeft') {
      playerX = Math.max(playerX - playerSpeed, 0);
    } else if (event.key === 'ArrowRight') {
      playerX = Math.min(playerX + playerSpeed, window.innerWidth - player.offsetWidth);
    } else if (event.key === 'ArrowUp' && Date.now() - lastPlayerShotTime > regularShootCooldown) {
      shoot();
      lastPlayerShotTime = Date.now();
    } else if (event.key === 'ArrowDown' && Date.now() - lastPlayer2ShotTime > specialShootCooldown) {
      splitShot();
      lastPlayer2ShotTime = Date.now();
    }
    player.style.left = `${playerX}px`;
  });

  document.addEventListener('keydown', (event) => {
    if (gameOver) return;

    if (event.key === 'a') {
      player2X = Math.max(player2X - player2Speed, 0);
    } else if (event.key === 'd') {
      player2X = Math.min(player2X + player2Speed, window.innerWidth - player2.offsetWidth);
    } else if (event.key === 'w' && Date.now() - lastPlayer2ShotTime > regularShootCooldown) {
      shoot2();
      lastPlayer2ShotTime = Date.now();
    } else if (event.key === 's' && Date.now() - lastPlayerShotTime > specialShootCooldown) {
      splitShot2();
      lastPlayerShotTime = Date.now();
    }
    player2.style.left = `${player2X}px`;
  });

  function shoot() {
    const projectile = document.createElement('div');
    projectile.classList.add('projectile');
    projectile.style.left = `${playerX + player.offsetWidth / 2 - 5}px`;
    projectile.style.bottom = `${player.offsetHeight + 20}px`;
    gameContainer.appendChild(projectile);
    projectiles.push(projectile);

    const moveProjectile = setInterval(() => {
      let bottom = parseInt(projectile.style.bottom);
      if (bottom > window.innerHeight) {
        projectile.remove();
        clearInterval(moveProjectile);
      } else {
        projectile.style.bottom = `${bottom + 5}px`;
      }
    }, 100);
  }

  function shoot2() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${player2X + player2.offsetWidth / 2 - 5}px`;
    bullet.style.bottom = `${player2.offsetHeight}px`;
    gameContainer.appendChild(bullet);
    bullets.push(bullet);

    const moveBullet = setInterval(() => {
      let bottom = parseInt(bullet.style.bottom);
      if (bottom < 0) {
        bullet.remove();
        clearInterval(moveBullet);
      } else {
        bullet.style.bottom = `${bottom + 5}px`;
      }
    }, 100);
  }

  function splitShot() {
    const numBullets = 5;
    const spreadAngle = Math.PI / 4; // 45 degrees spread angle

    for (let i = 0; i < numBullets; i++) {
      const angle = Math.PI / 2 - i * spreadAngle + (spreadAngle * (numBullets - 1)) / 2;
      createProjectile(playerX + player.offsetWidth / 2 - 5, player.offsetHeight + 20, angle);
    }

    function createProjectile(left, bottom, angle) {
      const projectile = document.createElement('div');
      projectile.classList.add('projectile');
      projectile.style.left = `${left}px`;
      projectile.style.bottom = `${bottom}px`;
      gameContainer.appendChild(projectile);
      projectiles.push(projectile);

      const moveProjectile = setInterval(() => {
        let projectileBottom = parseInt(projectile.style.bottom);
        let projectileLeft = parseInt(projectile.style.left);

        if (projectileBottom > window.innerHeight || projectileLeft < 0 || projectileLeft > window.innerWidth) {
          projectile.remove();
          clearInterval(moveProjectile);
        } else {
          const deltaX = Math.cos(angle) * 5; // 5 is the projectile speed
          const deltaY = Math.sin(angle) * 5;
          projectile.style.left = `${projectileLeft + deltaX}px`;
          projectile.style.bottom = `${projectileBottom + deltaY}px`;
        }
      }, 100);
    }
  }

  function splitShot2() {
    const numBullets = 5;
    const spreadAngle = Math.PI / 4; // 45 degrees spread angle

    for (let i = 0; i < numBullets; i++) {
      const angle = Math.PI / 2 - i * spreadAngle + (spreadAngle * (numBullets - 1)) / 2;
      createBullet(player2X + player2.offsetWidth / 2 - 5, player2.offsetHeight, angle);
    }

    function createBullet(left, bottom, angle) {
      const bullet = document.createElement('div');
      bullet.classList.add('bullet');
      bullet.style.left = `${left}px`;
      bullet.style.bottom = `${bottom}px`;
      gameContainer.appendChild(bullet);
      bullets.push(bullet);

      const moveBullet = setInterval(() => {
        let bulletBottom = parseInt(bullet.style.bottom);
        let bulletLeft = parseInt(bullet.style.left);

        if (bulletBottom > window.innerHeight || bulletLeft < 0 || bulletLeft > window.innerWidth) {
          bullet.remove();
          clearInterval(moveBullet);
        } else {
          const deltaX = Math.cos(angle) * 5; // 5 is the bullet speed
          const deltaY = Math.sin(angle) * 5;
          bullet.style.left = `${bulletLeft + deltaX}px`;
          bullet.style.bottom = `${bulletBottom + deltaY}px`;
        }
      }, 100);
    }
  }

  function spawnTarget() {
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
    target.style.top = '0px';
    gameContainer.appendChild(target);
    targets.push(target);

    const moveTarget = setInterval(() => {
      let top = parseInt(target.style.top);
      if (top > window.innerHeight) {
        target.remove();
        clearInterval(moveTarget);
      } else {
        target.style.top = `${top + 2}px`;
      }
    }, 100);
  }

  function spawnMultipleTargets() {
    // 1/5 chance of spawning 10 targets
    if (Math.random() < 0.2) {
      for (let i = 0; i < 10; i++) {
        spawnTarget();
      }
    }
  }

  function update() {
    if (gameOver) return;

    projectiles.forEach((projectile, index) => {
      let bottom = parseInt(projectile.style.bottom);
      if (bottom > window.innerHeight) {
        projectile.remove();
        projectiles.splice(index, 1);
      } else {
        projectile.style.bottom = `${bottom + 5}px`;
      }
    });

    bullets.forEach((bullet, index) => {
      let bottom = parseInt(bullet.style.bottom);
      if (bottom > window.innerHeight) {
        bullet.remove();
        bullets.splice(index, 1);
      } else {
        bullet.style.bottom = `${bottom + 5}px`;
      }
    });

    targets.forEach((target, index) => {
      let top = parseInt(target.style.top);
      if (top > window.innerHeight) {
        target.remove();
        targets.splice(index, 1);
      } else {
        target.style.top = `${top + 2}px`;
      }
    });

    checkCollisions();
    requestAnimationFrame(update);
  }

  function checkCollisions() {
    projectiles.forEach((projectile, pIndex) => {
      const pRect = projectile.getBoundingClientRect();
      targets.forEach((target, tIndex) => {
        const tRect = target.getBoundingClientRect();
        if (
          pRect.left < tRect.right &&
          pRect.right > tRect.left &&
          pRect.top < tRect.bottom &&
          pRect.bottom > tRect.top
        ) {
          target.remove();
          projectile.remove();
          targets.splice(tIndex, 1);
          projectiles.splice(pIndex, 1);
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
        }
      });
    });

    bullets.forEach((bullet, bIndex) => {
      const bRect = bullet.getBoundingClientRect();
      targets.forEach((target, tIndex) => {
        const tRect = target.getBoundingClientRect();
        if (
          bRect.left < tRect.right &&
          bRect.right > tRect.left &&
          bRect.top < tRect.bottom &&
          bRect.bottom > tRect.top
        ) {
          target.remove();
          bullet.remove();
          targets.splice(tIndex, 1);
          bullets.splice(bIndex, 1);
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
        }
      });
    });

    targets.forEach((target) => {
      const tRect = target.getBoundingClientRect();
      const pRect1 = player.getBoundingClientRect();
      const pRect2 = player2.getBoundingClientRect();

      if (
        (pRect1.left < tRect.right &&
        pRect1.right > tRect.left &&
        pRect1.top < tRect.bottom &&
        pRect1.bottom > tRect.top) ||
        (pRect2.left < tRect.right &&
        pRect2.right > tRect.left &&
        pRect2.top < tRect.bottom &&
        pRect2.bottom > tRect.top)
      ) {
        gameOver = true;
        alert(`Game Over! Your score is: ${score}`);
        restartButton.style.display = 'block';
      }
    });
  }

  function restartGame() {
    // Reset positions
    playerX = window.innerWidth / 2 - player.offsetWidth / 2;
    player2X = window.innerWidth / 2 - player2.offsetWidth / 2;
    player.style.left = `${playerX}px`;
    player2.style.left = `${player2X}px`;

    // Clear all projectiles, bullets, and targets
    projectiles.forEach(projectile => projectile.remove());
    bullets.forEach(bullet => bullet.remove());
    targets.forEach(target => target.remove());
    projectiles.length = 0;
    bullets.length = 0;
    targets.length = 0;

    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;

    gameOver = false;
    restartButton.style.display = 'none';
    startGame();
  }

  restartButton.addEventListener('click', restartGame);

  function startGame() {
    spawnTarget();
    setInterval(spawnTarget, 2000); // Spawn a new target every 2 seconds
    setInterval(spawnMultipleTargets, 3000); // 1/5 chance of spawning 10 targets every 3 seconds
    update();
  }

  // Start the game initially
  startGame();
};

