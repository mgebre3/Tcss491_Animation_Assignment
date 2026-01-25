const canvas = document.getElementById("gameWorld");
const ctx = canvas.getContext("2d");

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/player.png");

ASSET_MANAGER.downloadAll(() => {
  const game = new GameEngine();
  game.init(ctx);

  // Layout constants
  const SCALE = 2;
  const FRAME_W = 64;
  const PLAYER_W = FRAME_W * SCALE;
  const centerX = (canvas.width - PLAYER_W) / 2;

  const P1_Y = 420; // bottom player
  const P2_Y = 60;  // top player

  // Two players
  const p1 = new Player(game, centerX, P1_Y, { left: "a", right: "d", hit: " " }, SCALE);
  const p2 = new Player(game, centerX, P2_Y, { left: "j", right: "l", hit: "i" }, SCALE);

  // Ball
  const ball = new Ball(game, canvas.width / 2, canvas.height / 2);

  // Start paused
  game.isPaused = true;
  ball.active = false;

  game.addEntity(p1);
  game.addEntity(p2);
  game.addEntity(ball);

  // Draw first frame (so you see something before starting)
  game.draw();

  // Buttons
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");

  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const hitBtn = document.getElementById("hitBtn");

  // Helpers for button controls
  const holdKey = (btn, key) => {
    const down = (e) => { e.preventDefault(); game.keys[key] = true; };
    const up   = (e) => { e.preventDefault(); game.keys[key] = false; };

    btn.addEventListener("mousedown", down);
    btn.addEventListener("mouseup", up);
    btn.addEventListener("mouseleave", up);

    btn.addEventListener("touchstart", down, { passive: false });
    btn.addEventListener("touchend", up, { passive: false });
  };

  const tapKey = (btn, key, ms = 120) => {
    const tap = (e) => {
      e.preventDefault();
      game.keys[key] = true;
      setTimeout(() => (game.keys[key] = false), ms);
    };
    btn.addEventListener("click", tap);
    btn.addEventListener("touchstart", tap, { passive: false });
  };

  // P1 buttons (A/D/Space)
  holdKey(leftBtn, "a");
  holdKey(rightBtn, "d");
  tapKey(hitBtn, " ", 120);

  // START
  startBtn.addEventListener("click", () => {
    game.isPaused = false;
    ball.active = true;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;

    game.start();
  });

  // PAUSE / RESUME
  pauseBtn.addEventListener("click", () => {
    game.isPaused = !game.isPaused;
    ball.active = !game.isPaused;
    pauseBtn.textContent = game.isPaused ? "▶ Resume" : "⏸ Pause";
  });

  // RESET
  resetBtn.addEventListener("click", () => {
    game.isPaused = true;
    ball.active = false;

    // Clear keys
    ["a", "d", " ", "j", "l", "i"].forEach(k => game.keys[k] = false);

    // Reset positions
    p1.x = centerX; p1.y = P1_Y;
    p2.x = centerX; p2.y = P2_Y;
    ball.reset(canvas.width / 2, canvas.height / 2);

    pauseBtn.textContent = "⏸ Pause";
    game.draw();
  });
});
