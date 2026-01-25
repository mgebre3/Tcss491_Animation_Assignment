class Player {
  constructor(game, x, y, scale = 2) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.speed = 260;
    this.moving = false;

    // Sprite must exist at: assets/player.png
    this.sheet = ASSET_MANAGER.getAsset("./assets/player.png");

    // Sprite layout (64x64):
    // Row 0: idle (4 frames)
    // Row 1: run  (6 frames)
    this.idle = new Animator(this.sheet, 64, 64, 4, 0.20, 0);
    this.run  = new Animator(this.sheet, 64, 64, 6, 0.10, 1);
  }

  update() {
    const k = this.game.keys;
    const tick = this.game.clockTick;

    let dx = 0;
    let dy = 0;

    // Left / Right
    if (k["arrowleft"] || k["a"]) dx -= 1;
    if (k["arrowright"] || k["d"]) dx += 1;

    // Up / Down
    if (k["arrowup"] || k["w"]) dy -= 1;
    if (k["arrowdown"] || k["s"]) dy += 1;

    this.moving = (dx !== 0 || dy !== 0);

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    this.x += dx * this.speed * tick;
    this.y += dy * this.speed * tick;

    // Keep inside canvas
    const size = 64 * this.scale;
    const maxX = this.game.ctx.canvas.width - size;
    const maxY = this.game.ctx.canvas.height - size;

    this.x = clamp(this.x, 0, maxX);
    this.y = clamp(this.y, 0, maxY);
  }

  draw(ctx) {
    // Sprite
    if (this.moving) {
      this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    } else {
      this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.scale);
    }

    // Always visible racket
    this.drawRacket(ctx);
  }

  drawRacket(ctx) {
    const s = this.scale;
    const bodyW = 64 * s;

    const racketX = this.x + bodyW - 10;
    const racketY = this.y + 30 * s;

    // Handle
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(racketX, racketY, 8, 26);

    // Head
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(racketX + 4, racketY - 6, 12, 16, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
