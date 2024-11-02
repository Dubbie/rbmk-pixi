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

  drawGrid() {
    let _rows = [];

    for (let r = 0; r < this.rows; r++) {
      let _cols = [];

      for (let c = 0; c < this.cols; c++) {
        const cell = new Container();
        this.container.addChild(cell);

        // Set up the cell
        cell.width = this.cellSize;
        cell.height = this.cellSize;
        cell.x = c * this.cellSize + this.gap * c;
        cell.y = r * this.cellSize + this.gap * r;
        cell.pivot.x = this.cellSize / 2;
        cell.pivot.y = this.cellSize / 2;

        // Draw the background
        const bg = new Graphics();
        bg.rect(
          -this.cellSize / 2,
          -this.cellSize / 2,
          this.cellSize,
          this.cellSize,
        ).fill({
          color: "rgb(235,245,255)",
        });
        cell.addChild(bg);

        // Draw the element
        const element = new Element(URANIUM_TYPE, URANIUM_COLOR);
        cell.addChild(element.gfx);

        // Store this object for later use.
        _cols.push({
          x: c,
          y: r,
          cell: {
            container: cell,
            background: bg,
          },
        });
      }

      _rows.push(_cols);
    }

    this.grid = _rows;
  }

  centerContainer() {
    // Move container to the center
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;

    // Center in local container coordinates
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }

  init() {
    console.log("Initializing Reactor Grid.");
    this.drawGrid();
    this.centerContainer();

    this.app.stage.addChild(this.container);
  }
}
