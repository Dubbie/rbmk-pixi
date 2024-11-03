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

  insert(obj) {
    // Get the global bounds of the object
    const { minX, maxX, minY, maxY } = obj.graphics.getBounds();

    // Calculate which cells the object occupies based on its bounds
    const minCellX = Math.floor(minX / this.cellSize);
    const maxCellX = Math.floor(maxX / this.cellSize);
    const minCellY = Math.floor(minY / this.cellSize);
    const maxCellY = Math.floor(maxY / this.cellSize);

    // Iterate over each cell the object occupies and add it to the hash
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const cellKey = `${cellX},${cellY}`;
        if (!this.buckets[cellKey]) {
          this.buckets[cellKey] = [];
        }
        this.buckets[cellKey].push(obj);
      }
    }
  }

  remove(obj) {
    // Get the global bounds of the object
    const { minX, maxX, minY, maxY } = obj.getBounds();

    // Calculate which cells the object occupies
    const minCellX = Math.floor(minX / this.cellSize);
    const maxCellX = Math.floor(maxX / this.cellSize);
    const minCellY = Math.floor(minY / this.cellSize);
    const maxCellY = Math.floor(maxY / this.cellSize);

    // Iterate over each cell the object occupies and remove it from the hash
    for (let cellX = minCellX; cellX <= maxCellX; cellX++) {
      for (let cellY = minCellY; cellY <= maxCellY; cellY++) {
        const cellKey = `${cellX},${cellY}`;
        const cell = this.buckets[cellKey];
        if (cell) {
          this.buckets[cellKey] = cell.filter((item) => item !== obj);
          // Clean up the bucket if it's empty
          if (this.buckets[cellKey].length === 0) {
            delete this.buckets[cellKey];
          }
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
      const cell = this.buckets[adjacentKey];
      if (cell) nearbyElements.push(...cell);
    }

    return nearbyElements;
  }
}

export default SpatialHash;
