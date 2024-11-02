import { Container, Graphics } from "pixi.js";
import {
  GRID_COLS,
  GRID_ELEMENT_RADIUS,
  GRID_GAP,
  GRID_ROWS,
} from "./constants";

export class ReactorGrid {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this.rows = GRID_ROWS;
    this.cols = GRID_COLS;
    this.gap = GRID_GAP;
    this.elementRadius = GRID_ELEMENT_RADIUS;

    this.init();
  }

  drawCircles() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const gfx = new Graphics();

        const x = c * this.elementRadius * 2 + this.gap * c;
        const y = r * this.elementRadius * 2 + this.gap * r;

        // Draw the circle
        gfx.circle(x, y, this.elementRadius).fill({ color: 0x4499ff });

        this.container.addChild(gfx);
      }
    }
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
    this.drawCircles();
    this.centerContainer();

    this.app.stage.addChild(this.container);
  }
}
