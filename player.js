class Player {
  constructor(game, x, y, controls, scale = 2) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.controls = controls;
    this.scale = scale;

    this.speed = 300;
    this.moving = false;

    this.isHitting = false;
    this.hitTimer = 0;

    const sheet = ASSET_MANAGER.getAsset("./assets/player.png");

    this.idle = new Animator(sheet, 64, 64, 4, 0.2, 0);
    this.run  = new Animator(sheet, 64, 64, 6, 0.1, 1);

    // If your sprite sheet has a HIT row, set row=2 and frames=4
    // If not, you can keep it as idle (still works)
    this.hit  = new Animator(sheet, 64, 64, 4, 0.08, 0);
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

    // Hit (Space or HIT button)
    if (k[this.controls.hit] && !this.isHitting) {
      this.isHitting = true;
      this.hitTimer = 0;
    }

    if (this.isHitting) {
      this.hitTimer += this.game.clockTick;
      if (this.hitTimer > 0.25) this.isHitting = false;
    }

    // Keep on screen
    const maxX = this.game.ctx.canvas.width - (64 * this.scale);
    this.x = Math.max(0, Math.min(maxX, this.x));
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
