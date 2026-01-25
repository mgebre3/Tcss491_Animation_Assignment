class Ball {
  constructor(game, x, y) {
    this.game = game;

    this.r = 10;
    this.active = false;

    this.baseSpeedX = 220;
    this.baseSpeedY = 150;

    this.angleBoost = 120;  // sideways change when hitting paddle edges
    this.hitBoost = 1.10;   // speed increase if player is hitting

    this.reset(x, y);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;

    const dirX = Math.random() < 0.5 ? -1 : 1;
    const dirY = Math.random() < 0.5 ? -1 : 1;

    this.vx = dirX * this.baseSpeedX;
    this.vy = dirY * this.baseSpeedY;
  }

  update() {
    if (!this.active) return;

    const tick = this.game.clockTick;
    const W = this.game.ctx.canvas.width;
    const H = this.game.ctx.canvas.height;

    // Move
    this.x += this.vx * tick;
    this.y += this.vy * tick;

    // Wall bounce
    if (this.x < this.r) { this.x = this.r; this.vx *= -1; }
    if (this.x > W - this.r) { this.x = W - this.r; this.vx *= -1; }

    // Keep top/bottom bounce (demo style)
    if (this.y < this.r) { this.y = this.r; this.vy *= -1; }
    if (this.y > H - this.r) { this.y = H - this.r; this.vy *= -1; }

    // Player collisions
    this.handlePlayerCollisions();
  }

  handlePlayerCollisions() {
    for (const e of this.game.entities) {
      if (!(e instanceof Player)) continue;

      const rect = e.getRect();
      if (!circleHitsRect(this.x, this.y, this.r, rect)) continue;

      // Bounce vertically (table tennis feeling)
      this.vy *= -1;

      // Add angle depending on where it hits paddle (-1..1)
      const center = rect.x + rect.w / 2;
      const offset = (this.x - center) / (rect.w / 2);
      this.vx += offset * this.angleBoost;

      // Faster if player is hitting
      if (e.isHitting) {
        this.vx *= this.hitBoost;
        this.vy *= this.hitBoost;
      }

      // Push out to avoid sticking
      if (this.vy > 0) this.y = rect.y + rect.h + this.r;
      else this.y = rect.y - this.r;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Collision helper: circle vs rect
function circleHitsRect(cx, cy, r, rect) {
  const closestX = clamp2(cx, rect.x, rect.x + rect.w);
  const closestY = clamp2(cy, rect.y, rect.y + rect.h);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return (dx * dx + dy * dy) <= (r * r);
}

function clamp2(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
