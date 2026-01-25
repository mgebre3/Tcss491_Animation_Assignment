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

    // --- Background ---
    ctx.fillStyle = "#e9e9e9";
    ctx.fillRect(0, 0, W, H);

    // --- Table tennis court lines ---
    const margin = 30;

    // Outer court rectangle
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 3;
    ctx.strokeRect(margin, margin, W - margin * 2, H - margin * 2);

    // Center line (horizontal, like table tennis net line)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, H / 2);
    ctx.lineTo(W - margin, H / 2);
    ctx.stroke();

    // Optional: small center circle
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 16, 0, Math.PI * 2);
    ctx.stroke();

    // --- Draw entities (players + ball) ---
    for (const e of this.entities) e.draw(ctx);
  }
}
