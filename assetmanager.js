class AssetManager {
  constructor() {
    this.cache = {};
    this.queue = [];
  }

  queueDownload(p) {
    this.queue.push(p);
  }

  downloadAll(cb) {
    let loaded = 0;
    this.queue.forEach(p => {
      const img = new Image();
      img.onload = () => {
        this.cache[p] = img;
        loaded++;
        if (loaded === this.queue.length) cb();
      };
      img.src = p;
    });
  }

  getAsset(p) {
    return this.cache[p];
  }
}
