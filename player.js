class Player {
  constructor(game, x, y, controls, scale = 2) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.controls = controls;
    this.scale = scale;

    this.speed = 320;
    this.moving = false;

    this.isHitting = false;
    this.hitTimer = 0;
    this.hitDuration = 0.25;

    // Sprite must be here: assets/player.png
    this.sheet = ASSET_MANAGER.getAsset("./assets/player.png");

    // Sprite layout:
    // Row 0: idle (4 frames)
    // Row 1: run  (6 frames)
    this.idle = new Animator(this.sheet, 64, 64, 4, 0.20, 0);
    this.run  = new Animator(this.sheet, 64, 64, 6, 0.10, 1);

    // Hit animation (reuses idle row; still works)
    this.hit  = new Animator(this.sheet, 64, 64, 4, 0.08, 0);

    // Racket hitbox (updated every draw)
    this.racketRect = { x: 0, y: 0, w: 6, h: 22 };
  }

  // Body hitbox (not used for ball now, but still useful)
  getRect() {
    const size = 64 * this.scale;
    return { x: this.x, y: this.y, w: size, h: size };
  }

  // Racket hitbox (used for collision)
  getRacketRect() {
    return this.racketRect;
  }

  update() {
    if (this.game.isPaused) return;

    const k = this.game.keys;
    const tick = this.game.clockTick;

    this.moving = false;

    if (k[this.controls.left]) {
      this.x -= this.speed * tick;
      this.moving = true;
    }
    if (k[this.controls.right]) {
      this.x += this.speed * tick;
      this.moving = true;
    }

    // Hit input
    if (k[this.controls.hit] && !this.isHitting) {
      this.isHitting = true;
      this.hitTimer = 0;
    }

    if (this.isHitting) {
      this.hitTimer += tick;
      if (this.hitTimer > this.hitDuration) this.isHitting = false;
    }

    // Keep player on screen
    const maxX = this.game.ctx.canvas.width - (64 * this.scale);
    this.x = clamp(this.x, 0, maxX);
  }

  draw(ctx) {
    // Draw sprite
    if (this.isHitting) {
      this.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    } else if (this.moving) {
      this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    } else {
      this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }

    // Always draw racket (always held)
    this.drawRacket(ctx);
  }

  // Draw racket + update racket hitbox each frame
  drawRacket(ctx) {
    const s = this.scale;
    const bodyW = 64 * s;

    // Put P2 racket on left, P1 racket on right (looks nice)
    const isTopPlayer = this.y < this.game.ctx.canvas.height / 2;

    // RACKET HANDLE rectangle hitbox (used for collision)
    this.racketRect = {
      x: isTopPlayer ? this.x + 6 : this.x + bodyW - 12,
      y: this.y + 30 * s,
      w: 10,          // wider = easier to hit
      h: 28
    };

    // Handle
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(this.racketRect.x, this.racketRect.y, this.racketRect.w, this.racketRect.h);

    // Head (visual only)
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      this.racketRect.x + this.racketRect.w / 2,
      this.racketRect.y - 6,
      12,
      16,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }
}

// Helper
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
