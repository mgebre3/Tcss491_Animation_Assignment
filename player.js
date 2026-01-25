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

    // Hit animation (for now reuses idle row; still works)
    this.hit  = new Animator(this.sheet, 64, 64, 4, 0.08, 0);
  }

  getRect() {
    const size = 64 * this.scale;
    return { x: this.x, y: this.y, w: size, h: size };
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

    // Draw racket on top of player
    this.drawRacket(ctx);
  }

  // Simple racket drawing (so player “holds” it)
  drawRacket(ctx) {
    const s = this.scale;
    const bodyW = 64 * s;

    // Default: racket on the right side
    // Player 2 (top) can have racket on the left for variety
    const isTopPlayer = this.y < this.game.ctx.canvas.height / 2;

    const racketX = isTopPlayer ? this.x + 6 : this.x + bodyW - 12;
    const racketY = this.y + 30 * s;

    // Handle
    ctx.fillStyle = "#8b5a2b"; // brown
    ctx.fillRect(racketX, racketY, 6, 22);

    // Head
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      racketX + 3,
      racketY - 6,
      10,
      14,
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
