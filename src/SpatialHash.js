class SpatialHash {
  constructor(cellSize) {
    this.cellSize = cellSize; // Size of each cell
    this.buckets = {}; // Storage for elements, using string keys for coordinates
  }

  // Convert coordinates to a cell key
  _getKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`; // Use a string key for easy access
  }

  // Insert an element into the spatial hash
  insert(element) {
    const { x, y } = element.globalPosition; // Use global position
    const key = this._getKey(x, y);
    if (!this.buckets[key]) {
      this.buckets[key] = [];
    }
    this.buckets[key].push(element);
  }

  // Remove an element from the spatial hash
  remove(element) {
    const { x, y } = element.globalPosition; // Use global position
    const key = this._getKey(x, y);
    if (this.buckets[key]) {
      this.buckets[key] = this.buckets[key].filter((e) => e !== element);
      if (this.buckets[key].length === 0) {
        delete this.buckets[key]; // Remove empty buckets
      }
    }
  }

  // Get nearby elements for collision checking
  getNearbyElements(x, y) {
    const key = this._getKey(x, y);
    const nearbyElements = [];

    // Check the current cell and adjacent cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const adjacentKey = this._getKey(
          x + dx * this.cellSize,
          y + dy * this.cellSize
        );
        if (this.buckets[adjacentKey]) {
          nearbyElements.push(...this.buckets[adjacentKey]);
        }
      }
    }

    return nearbyElements;
  }
}

export default SpatialHash;
