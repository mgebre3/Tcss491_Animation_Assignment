class Player {
  constructor(game, x, y, controls) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.controls = controls;

    this.speed = 300;
    this.moving = false;

    // IMPORTANT: This path must match your repo:
    // repo should contain: assets/player.png
    this.sprite = ASSET_MANAGER.getAsset("./assets/player.png");

    // If sprite didn’t load, you’ll still see a fallback rectangle
    this.idle = this.sprite ? new Animator(this.sprite, 64, 64, 4, 0.2, 0) : null;
    this.run  = this.sprite ? new Animator(this.sprite, 64, 64, 6, 0.1, 1) : null;
  }

  update() {
    const k = this.game.keys;
    this.moving = false;

    if (k[this.controls.left]) {
      this.x -= this.speed * this.game.clockTick;
      this.moving = true;
    }

    if (k[this.controls.right]) {
      this.x += this.speed * this.game.clockTick;
      this.moving = true;
    }

    // Keep player on screen
    const maxX = this.game.ctx.canvas.width - 64 * 2; // 64 frame * scale(2)
    this.x = Math.max(0, Math.min(maxX, this.x));
  }

  draw(ctx) {
    const scale = 2;

    // Fallback if sprite not loaded: draw a visible rectangle
    if (!this.sprite) {
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, 50, 50);
      return;
    }

    if (this.moving) {
      this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
    } else {
      this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y, scale);
    }
  }
}
