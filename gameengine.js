class GameEngine {
  constructor() {
    this.entities = [];
    this.keys = {};
    this.clockTick = 0;
    this.isPaused = true;
    this.started = false;
  }

  init(ctx) {
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;

    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    this.last = performance.now();
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  start() {
    if (this.started) return;
    this.started = true;

    const loop = (t) => {
      this.clockTick = (t - this.last) / 1000;
      this.last = t;

      this.update();
      this.draw();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  update() {
    if (this.isPaused) return;
    for (const e of this.entities) e.update();
  }

  draw() {
    const w = this.ctx.canvas.width;
    const h = this.ctx.canvas.height;

    // Always draw a visible background
    this.ctx.fillStyle = "#eeeeee";
    this.ctx.fillRect(0, 0, w, h);

    for (const e of this.entities) e.draw(this.ctx);
  }
}
