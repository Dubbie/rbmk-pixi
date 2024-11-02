import { Container, Graphics, Point } from "pixi.js";
import {
  GRID_CELL_SIZE,
  GRID_COLS,
  GRID_GAP,
  GRID_ROWS,
  URANIUM_COLOR,
  URANIUM_TYPE,
} from "./constants";
import { Element } from "./Element";

const DEBUG_ACTIVE_CELL = false;

export class ReactorGrid {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this.rows = GRID_ROWS;
    this.cols = GRID_COLS;
    this.gap = GRID_GAP;
    this.cellSize = GRID_CELL_SIZE;
    this.grid = [];
    this.neutrons = [];
    this.lastActiveCell = null;

    this.init();
  }

  createCell(row, col) {
    const x = col * (this.cellSize + this.gap);
    const y = row * (this.cellSize + this.gap);
    const cell = new Container();
    cell.x = x;
    cell.y = y;
    const background = this.createCellBackground();
    const element = new Element(URANIUM_TYPE, URANIUM_COLOR, this.app, this);
    element.gfx.x = this.cellSize / 2;
    element.gfx.y = this.cellSize / 2;

    cell.addChild(background, element.gfx);
    return { cell, background, element };
  }

  createCellBackground() {
    const background = new Graphics();
    background
      .rect(0, 0, this.cellSize, this.cellSize)
      .fill({ color: 0xffffff });
    background.tint = "rgb(235, 243, 255)";
    return background;
  }

  drawGrid() {
    this.grid = Array.from({ length: this.rows }, (_, r) => {
      return Array.from({ length: this.cols }, (_, c) => {
        const { cell, background, element } = this.createCell(r, c);
        this.container.addChild(cell);

        return { x: c, y: r, cell: { container: cell, background, element } };
      });
    });
  }

  centerContainer() {
    const gridWidth = this.cols * (this.cellSize + this.gap);
    const gridHeight = this.rows * (this.cellSize + this.gap);

    this.container.x = (this.app.screen.width - gridWidth) / 2;
    this.container.y = (this.app.screen.height - gridHeight) / 2;
  }

  getNeighboursByGlobalPosition(x, y) {
    const gridPosition = this.getGridPositionByGlobalPosition(x, y);

    // Offsets for the 8 neighboring cells + the center cell itself (optional)
    const neighborOffsets = [
      { dx: -1, dy: -1 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: -1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 },
      { dx: -1, dy: 1 },
      { dx: 0, dy: 1 },
      { dx: 1, dy: 1 },
    ];

    // Gather valid neighbors within bounds
    const neighbors = [];

    for (const { dx, dy } of neighborOffsets) {
      const neighborX = gridPosition.x + dx;
      const neighborY = gridPosition.y + dy;

      // Boundary check to ensure neighbor is within the grid
      if (
        neighborX >= 0 &&
        neighborX < this.cols &&
        neighborY >= 0 &&
        neighborY < this.rows
      ) {
        // Access the neighbor cell if within bounds
        neighbors.push(this.grid[neighborY][neighborX].cell.element); // Assuming each cell has an `element`
      }
    }

    console.log(
      `Neighbors of cell (${gridPosition.x}, ${gridPosition.y}):`,
      neighbors
    );
    return neighbors;
  }

  getGridPositionByGlobalPosition(x, y) {
    const transformedPos = this.container.toLocal(new Point(x, y));

    // Calculate the grid row and column based on cellSize and gap
    const gridX = Math.floor(transformedPos.x / (this.cellSize + this.gap));
    const gridY = Math.floor(transformedPos.y / (this.cellSize + this.gap));

    // Handle out-of-bounds grid positions
    if (gridX < 0 || gridX >= this.cols || gridY < 0 || gridY >= this.rows) {
      return null;
    }

    return { x: gridX, y: gridY };
  }

  getElementByGlobalPosition(x, y) {
    const gridPosition = this.getGridPositionByGlobalPosition(x, y);

    if (!gridPosition) {
      return null;
    }

    // Handle out-of-bounds grid positions
    if (
      gridPosition.x < 0 ||
      gridPosition.x >= this.cols ||
      gridPosition.y < 0 ||
      gridPosition.y >= this.rows
    ) {
      return null;
    }

    const data = this.grid[gridPosition.y][gridPosition.x];

    if (this.lastActiveCell !== data.cell) {
      if (this.lastActiveCell && DEBUG_ACTIVE_CELL) {
        this.lastActiveCell.background.tint = "rgb(235, 243, 255)";
      }

      this.lastActiveCell = data.cell;
      if (DEBUG_ACTIVE_CELL) {
        data.cell.background.tint = "rgb(255, 100, 100)";
      }
    }

    return data.cell.element;
  }

  init() {
    console.log("Initializing Reactor Grid.");

    this.drawGrid();
    this.app.stage.addChild(this.container);
    this.centerContainer();
  }
}
