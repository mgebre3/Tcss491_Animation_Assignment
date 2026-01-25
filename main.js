const canvas = document.getElementById("gameWorld");
const ctx = canvas.getContext("2d");

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/player.png");

ASSET_MANAGER.downloadAll(() => {
  const game = new GameEngine();
  game.init(ctx);

  // Create player a bit higher so you can SEE it (scale=2 makes it tall)
  game.addEntity(new Player(game, 360, 420, { left: "a", right: "d", hit: " " }));
  game.addEntity(new Ball(game, 400, 300));

  // --- BUTTON CONTROLS (same keys as keyboard) ---
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  // Hold button = keep moving
  const press = (key) => () => (game.keys[key] = true);
  const release = (key) => () => (game.keys[key] = false);

  // Mouse support
  leftBtn.addEventListener("mousedown", press("a"));
  leftBtn.addEventListener("mouseup", release("a"));
  leftBtn.addEventListener("mouseleave", release("a"));

  rightBtn.addEventListener("mousedown", press("d"));
  rightBtn.addEventListener("mouseup", release("d"));
  rightBtn.addEventListener("mouseleave", release("d"));

  // Touch support (phones/tablets)
  leftBtn.addEventListener("touchstart", (e) => { e.preventDefault(); game.keys["a"] = true; }, { passive: false });
  leftBtn.addEventListener("touchend", (e) => { e.preventDefault(); game.keys["a"] = false; }, { passive: false });

  rightBtn.addEventListener("touchstart", (e) => { e.preventDefault(); game.keys["d"] = true; }, { passive: false });
  rightBtn.addEventListener("touchend", (e) => { e.preventDefault(); game.keys["d"] = false; }, { passive: false });

  game.start();
});
