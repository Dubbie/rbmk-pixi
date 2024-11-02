import { Container, Graphics } from "pixi.js";
import {
  GRID_CELL_SIZE,
  GRID_COLS,
  GRID_GAP,
  GRID_ROWS,
  URANIUM_COLOR,
  URANIUM_TYPE,
} from "./constants";
import { Element } from "./Element";

export class ReactorGrid {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this.rows = GRID_ROWS;
    this.cols = GRID_COLS;
    this.gap = GRID_GAP;
    this.cellSize = GRID_CELL_SIZE;
    this.grid = [];

    this.init();
  }

  createCell(x, y) {
    const cell = new Container();
    cell.width = this.cellSize;
    cell.height = this.cellSize;
    cell.position.set(x, y);
    cell.pivot.set(this.cellSize / 2, this.cellSize / 2);

    const background = this.createCellBackground();
    const element = new Element(URANIUM_TYPE, URANIUM_COLOR);

    cell.addChild(background, element.gfx);
    return { cell, background, element };
  }

  createCellBackground() {
    const background = new Graphics();
    background
      .rect(
        -this.cellSize / 2,
        -this.cellSize / 2,
        this.cellSize,
        this.cellSize,
      )
      .fill({ color: "rgb(235,245,255)" });
    return background;
  }

  drawGrid() {
    this.grid = Array.from({ length: this.rows }, (_, r) => {
      return Array.from({ length: this.cols }, (_, c) => {
        const x = c * (this.cellSize + this.gap);
        const y = r * (this.cellSize + this.gap);

        const { cell, background } = this.createCell(x, y);
        this.container.addChild(cell);

        return { x: c, y: r, cell: { container: cell, background } };
      });
    });
  }

  centerContainer() {
    this.container.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2,
    );
    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2,
    );
  }

  init() {
    console.log("Initializing Reactor Grid.");
    this.drawGrid();
    this.centerContainer();
    this.app.stage.addChild(this.container);
  }
}
