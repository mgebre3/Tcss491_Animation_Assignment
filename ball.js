class Ball {
  constructor(game, x, y) {
    this.game = game;

    this.r = 10;
    this.active = false;

    // Speeds
    this.serveSpeedY = 220;
    this.angleBoost = 120;
    this.hitBoost = 1.10;

    // Miss callback set in main.js
    this.onMiss = null;

    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  // Serve from a specific player
  serveFrom(player) {
    const rect = player.getRect();
    const midX = rect.x + rect.w / 2;

    this.x = midX;

    const H = this.game.ctx.canvas.height;
    const isTopPlayer = rect.y < H / 2;

    // place ball just outside the player
    this.y = isTopPlayer
      ? rect.y + rect.h + this.r + 2   // top serves down
      : rect.y - this.r - 2;           // bottom serves up

    // random sideways
    this.vx = (Math.random() * 160) - 80;
    this.vy = isTopPlayer ? this.serveSpeedY : -this.serveSpeedY;
  }

  update() {
    if (!this.active) return;

    const tick = this.game.clockTick;
    const W = this.game.ctx.canvas.width;
    const H = this.game.ctx.canvas.height;

    // Move
    this.x += this.vx * tick;
    this.y += this.vy * tick;

    // Left/right wall bounce
    if (this.x < this.r) { this.x = this.r; this.vx *= -1; }
    if (this.x > W - this.r) { this.x = W - this.r; this.vx *= -1; }

    // --- Miss detection (out of bounds) ---
    if (this.y > H + this.r) {
      this.active = false;
      if (this.onMiss) this.onMiss("p1"); // Player 1 missed
      return;
    }

    if (this.y < -this.r) {
      this.active = false;
      if (this.onMiss) this.onMiss("p2"); // Player 2 missed
      return;
    }

    // --- Collision with rackets only ---
    for (const e of this.game.entities) {
      if (!(e instanceof Player)) continue;

      const racket = e.getRacketRect();
      if (!racket) continue;

      if (!circleHitsRect(this.x, this.y, this.r, racket)) continue;

      // Bounce vertically
      this.vy *= -1;

      // Angle based on hit position
      const center = racket.x + racket.w / 2;
      const offset = (this.x - center) / (racket.w / 2); // -1..1
      this.vx += offset * this.angleBoost;

      // Boost if player is hitting
      if (e.isHitting) {
        this.vx *= this.hitBoost;
        this.vy *= this.hitBoost;
      }

      // Push out so it doesn't stick
      if (this.vy > 0) this.y = racket.y + racket.h + this.r;
      else this.y = racket.y - this.r;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ---- Helpers ----
function circleHitsRect(cx, cy, r, rect) {
  const closestX = clamp2(cx, rect.x, rect.x + rect.w);
  const closestY = clamp2(cy, rect.y, rect.y + rect.h);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return (dx * dx + dy * dy) <= (r * r);
}

function clamp2(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
