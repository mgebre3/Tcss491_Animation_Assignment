class Animator {
  constructor(sheet, frameW, frameH, frameCount, frameDuration, row) {
    this.sheet = sheet;
    this.frameW = frameW;
    this.frameH = frameH;
    this.frameCount = frameCount;
    this.frameDuration = frameDuration;
    this.row = row;
    this.time = 0;
  }

  drawFrame(tick, ctx, x, y, scale = 2) {
    this.time += tick;
    const frame = Math.floor(this.time / this.frameDuration) % this.frameCount;

    ctx.drawImage(
      this.sheet,
      frame * this.frameW, this.row * this.frameH,
      this.frameW, this.frameH,
      x, y,
      this.frameW * scale, this.frameH * scale
    );
  }
}
