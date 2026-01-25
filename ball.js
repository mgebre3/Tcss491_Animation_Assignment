class Ball {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.vx = 200;
    this.vy = -150;
    this.r = 10;
  }

  update() {
    this.x += this.vx * this.game.clockTick;
    this.y += this.vy * this.game.clockTick;

    // bounce left/right
    if (this.x < this.r) {
      this.x = this.r;
      this.vx *= -1;
    }
    if (this.x > 800 - this.r) {
      this.x = 800 - this.r;
      this.vx *= -1;
    }

    // bounce top/bottom
    if (this.y < this.r) {
      this.y = this.r;
      this.vy *= -1;
    }
    if (this.y > 600 - this.r) {
      this.y = 600 - this.r;
      this.vy *= -1;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
