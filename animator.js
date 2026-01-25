class Animator {
  constructor(sheet, w, h, frames, speed, row) {
    this.sheet = sheet;
    this.w = w;
    this.h = h;
    this.frames = frames;
    this.speed = speed;
    this.row = row;
    this.time = 0;
  }

  drawFrame(tick, ctx, x, y, scale = 2) {
    this.time += tick;
    const f = Math.floor(this.time / this.speed) % this.frames;
    ctx.drawImage(
      this.sheet,
      f * this.w, this.row * this.h,
      this.w, this.h,
      x, y,
      this.w * scale, this.h * scale
    );
  }
}
