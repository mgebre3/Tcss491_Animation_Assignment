class GameEngine {
  constructor() {
    this.entities = [];
    this.keys = {};
    this.clockTick = 0;
  }

  init(ctx) {
    this.ctx = ctx;

    // Good for pixel/sprite graphics (prevents blur)
    this.ctx.imageSmoothingEnabled = false;

    // Keyboard input
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
    for (const e of this.entities) {
      e.update();
    }
  }

  draw() {
    const w = this.ctx.canvas.width;
    const h = this.ctx.canvas.height;

    // Always draw a background so you know the canvas is working
    this.ctx.fillStyle = "#eeeeee";
    this.ctx.fillRect(0, 0, w, h);

    for (const e of this.entities) {
      e.draw(this.ctx);
    }
  }
}
