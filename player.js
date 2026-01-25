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

    // Must exist in your repo: assets/player.png
    this.sheet = ASSET_MANAGER.getAsset("./assets/player.png");

    // Sprite layout:
    // Row 0: idle (4 frames)
    // Row 1: run  (6 frames)
    this.idle = new Animator(this.sheet, 64, 64, 4, 0.20, 0);
    this.run  = new Animator(this.sheet, 64, 64, 6, 0.10, 1);

    // Hit animation: if you later add a hit row, set row=2 here.
    // For now, we reuse idle frames (still works).
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

    // Hit key (space or "i")
    if (k[this.controls.hit] && !this.isHitting) {
      this.isHitting = true;
      this.hitTimer = 0;
    }

    if (this.isHitting) {
      this.hitTimer += tick;
      if (this.hitTimer > this.hitDuration) this.isHitting = false;
    }

    // Keep on screen
    const maxX = this.game.ctx.canvas.width - (64 * this.scale);
    this.x = clamp(this.x, 0, maxX);
  }

  draw(ctx) {
    if (this.isHitting) {
      this.hit.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    } else if (this.moving) {
      this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    } else {
      this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }
  }
}

// Helper used by Player
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
