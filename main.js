const canvas = document.getElementById("gameWorld");
const ctx = canvas.getContext("2d");

const ASSET_MANAGER = new AssetManager();
ASSET_MANAGER.queueDownload("./assets/player.png");

ASSET_MANAGER.downloadAll(() => {
  const game = new GameEngine();
  game.init(ctx);
  game.addEntity(new Player(game, 360, 500, { left: "a", right: "d", hit: " " }));
  game.addEntity(new Ball(game, 400, 300));
  game.start();
});
