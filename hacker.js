class Player {
  constructor(x, y, color, gamepadIndex) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.color = color;
    this.gamepadIndex = gamepadIndex;
    this.speed = 3;
    this.bullets = [];
    this.hasGun = true;
    this.cooldown = 0;
  }

  update() {
    const gp = navigator.getGamepads()[this.gamepadIndex];
    if (!gp) return;

    const dx = gp.axes[0]; // gauche/droite
    const dy = gp.axes[1]; // haut/bas

    if (Math.abs(dx) > 0.2) this.x += dx * this.speed;
    if (Math.abs(dy) > 0.2) this.y += dy * this.speed;

    // Tir avec le bouton X (index 2 sur Xbox)
    if (this.hasGun && gp.buttons[2].pressed && this.cooldown <= 0) {
      this.shoot();
      this.cooldown = 20; // cooldown entre tirs
    }

    if (this.cooldown > 0) this.cooldown--;

    // Mettre à jour les balles
    this.bullets.forEach(b => b.update());
    this.bullets = this.bullets.filter(b => !b.isOutOfBounds());
  }

  shoot() {
    const bullet = new Bullet(this.x + this.width / 2, this.y + this.height / 2, this.color, this.gamepadIndex);
    this.bullets.push(bullet);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.bullets.forEach(b => b.draw(ctx));
  }
}

class Bullet {
  constructor(x, y, color, direction) {
    this.x = x;
    this.y = y;
    this.radius = 5;
    this.color = color;
    this.speed = 7;
    this.direction = direction; // Use player gamepad index: 0 = left to right, 1 = right to left
  }

  update() {
    this.x += this.direction === 0 ? this.speed : -this.speed;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  isOutOfBounds() {
    return this.x < 0 || this.x > 800;
  }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const players = [
  new Player(100, 300, 'red', 0),
  new Player(700, 300, 'blue', 1)
];

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  players.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  requestAnimationFrame(gameLoop);
}

window.addEventListener("gamepadconnected", function(e) {
  console.log("Manette connectée : " + e.gamepad.index);
});

gameLoop();