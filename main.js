const canvas = document.getElementById("gameWorld");
const ctx = canvas.getContext("2d");

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/player.png");

ASSET_MANAGER.downloadAll(() => {
  const game = new GameEngine();
  game.init(ctx);

  // Start immediately (controls work right away)
  game.isPaused = false;

  // Center player
  const SCALE = 2;
  const size = 64 * SCALE;
  const startX = (canvas.width - size) / 2;
  const startY = (canvas.height - size) / 2;

  const player = new Player(game, startX, startY, SCALE);
  game.addEntity(player);

  game.start();
});
