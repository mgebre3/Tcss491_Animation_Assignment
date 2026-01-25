const canvas = document.getElementById("gameWorld");
const ctx = canvas.getContext("2d");

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/player.png");

ASSET_MANAGER.downloadAll(() => {
  const game = new GameEngine();
  game.init(ctx);

  // --- Constants (clean + easy to change) ---
  const SCALE = 2;
  const FRAME_W = 64;
  const PLAYER_W = FRAME_W * SCALE;

  // Center player horizontally
  const startX = (canvas.width - PLAYER_W) / 2;
  const startY = 420; // visible on screen for scale=2

  // Create game objects
  game.addEntity(new Player(game, startX, startY, { left: "a", right: "d", hit: " " }, SCALE));
  game.addEntity(new Ball(game, 400, 300));

  // --- Button Controls ---
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");
  const hitBtn = document.getElementById("hitBtn");

  // Helpers: press/release keys in the engine
  const setKey = (key, isDown) => () => (game.keys[key] = isDown);

  // Mouse (hold to move)
  leftBtn.addEventListener("mousedown", setKey("a", true));
  leftBtn.addEventListener("mouseup", setKey("a", false));
  leftBtn.addEventListener("mouseleave", setKey("a", false));

  rightBtn.addEventListener("mousedown", setKey("d", true));
  rightBtn.addEventListener("mouseup", setKey("d", false));
  rightBtn.addEventListener("mouseleave", setKey("d", false));

  // Hit button (tap = quick hit)
  hitBtn.addEventListener("click", () => {
    game.keys[" "] = true;
    setTimeout(() => (game.keys[" "] = false), 120);
  });

  // Touch support (mobile)
  const touchHold = (btn, key) => {
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); game.keys[key] = true; }, { passive: false });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); game.keys[key] = false; }, { passive: false });
  };

  touchHold(leftBtn, "a");
  touchHold(rightBtn, "d");

  hitBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    game.keys[" "] = true;
  }, { passive: false });

  hitBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    game.keys[" "] = false;
  }, { passive: false });

  game.start();
});
