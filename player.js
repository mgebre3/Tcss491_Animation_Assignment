class Player {
  constructor(game, x, y, controls) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.controls = controls;
    this.speed = 300;

    const sheet = ASSET_MANAGER.getAsset("./assets/player.png");
    this.idle = new Animator(sheet, 64, 64, 4, 0.2, 0);
    this.run  = new Animator(sheet, 64, 64, 6, 0.1, 1);
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
  }

  draw(ctx) {
    if (this.moving) {
      this.run.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
      this.idle.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
  }
}
