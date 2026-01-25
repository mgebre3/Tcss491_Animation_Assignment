class GameEngine {
  constructor() {
    this.entities = [];
    this.keys = {};
  }

  init(ctx) {
    this.ctx = ctx;
    window.addEventListener("keydown", e => this.keys[e.key.toLowerCase()] = true);
    window.addEventListener("keyup", e => this.keys[e.key.toLowerCase()] = false);
    this.last = performance.now();
  }

  addEntity(e) {
    this.entities.push(e);
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
    this.entities.forEach(e => e.update());
  }

  draw() {
    this.ctx.clearRect(0,0,800,600);
    this.entities.forEach(e => e.draw(this.ctx));
  }
}
