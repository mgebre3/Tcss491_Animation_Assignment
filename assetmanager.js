class AssetManager {
  constructor() {
    this.cache = {};
    this.queue = [];
  }

  queueDownload(path) {
    this.queue.push(path);
  }

  downloadAll(callback) {
    if (this.queue.length === 0) {
      callback();
      return;
    }

    let loaded = 0;
    this.queue.forEach((path) => {
      const img = new Image();
      img.onload = () => {
        this.cache[path] = img;
        loaded++;
        if (loaded === this.queue.length) callback();
      };
      img.onerror = () => console.error("Failed to load:", path);
      img.src = path;
    });
  }

  getAsset(path) {
    return this.cache[path];
  }
}
