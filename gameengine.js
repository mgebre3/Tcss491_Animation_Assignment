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
    const ctx = this.ctx;
    const W = ctx.canvas.width;
    const H = ctx.canvas.height;
    const margin = 30;

    /* ---------- TENNIS COURT ---------- */

    // Outer background (dark green)
    ctx.fillStyle = "#2e7d32";
    ctx.fillRect(0, 0, W, H);

    // Court area (lighter green)
    ctx.fillStyle = "#4caf50";
    ctx.fillRect(
      margin,
      margin,
      W - margin * 2,
      H - margin * 2
    );

    // Court border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      margin,
      margin,
      W - margin * 2,
      H - margin * 2
    );

    // Net line (center)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, H / 2);
    ctx.lineTo(W - margin, H / 2);
    ctx.stroke();

    // Center mark
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 14, 0, Math.PI * 2);
    ctx.stroke();

    /* ---------- ENTITIES ---------- */
    for (const e of this.entities) e.draw(ctx);
  }
}
