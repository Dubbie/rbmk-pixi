const OFFSETS = [
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

class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.buckets = {}; // Use a plain object for buckets
  }

  _getKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`; // Use a simple string key
  }

  insert(element) {
    const { x, y } = element.globalPosition;
    const key = this._getKey(x, y);
    if (!this.buckets[key]) {
      this.buckets[key] = []; // Initialize bucket if it doesn't exist
    }
    this.buckets[key].push(element);
  }

  remove(element) {
    const { x, y } = element.globalPosition;
    const key = this._getKey(x, y);
    const bucket = this.buckets[key];
    if (bucket) {
      const index = bucket.indexOf(element);
      if (index !== -1) {
        bucket.splice(index, 1); // Remove the element
        if (bucket.length === 0) {
          delete this.buckets[key]; // Remove empty buckets
        }
      }
    }
  }

  getNearbyElements(x, y) {
    const nearbyElements = [];

    for (const [dx, dy] of OFFSETS) {
      const adjacentKey = this._getKey(
        x + dx * this.cellSize,
        y + dy * this.cellSize
      );
      const cell = this.buckets[adjacentKey]; // Accessing the bucket as an object
      if (cell) nearbyElements.push(...cell);
    }

    return nearbyElements;
  }
}

export default SpatialHash;
