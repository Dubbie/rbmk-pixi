class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.buckets = new Map(); // Use a Map for buckets
  }

  _getKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`; // Use a simple string key
  }

  insert(element) {
    const { x, y } = element.globalPosition;
    const key = this._getKey(x, y);
    if (!this.buckets.has(key)) {
      this.buckets.set(key, []);
    }
    this.buckets.get(key).push(element);
  }

  remove(element) {
    const { x, y } = element.globalPosition;
    const key = this._getKey(x, y);
    const bucket = this.buckets.get(key);
    if (bucket) {
      const index = bucket.indexOf(element);
      if (index !== -1) {
        bucket.splice(index, 1);
        if (bucket.length === 0) {
          this.buckets.delete(key);
        }
      }
    }
  }

  getNearbyElements(x, y) {
    const key = this._getKey(x, y);
    const nearbyElements = [];
    const offsets = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];

    for (const [dx, dy] of offsets) {
      const adjacentKey = this._getKey(
        x + dx * this.cellSize,
        y + dy * this.cellSize
      );
      const cell = this.buckets.get(adjacentKey);
      if (cell) nearbyElements.push(...cell);
    }

    return nearbyElements;
  }
}

export default SpatialHash;
