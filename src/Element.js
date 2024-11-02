import { Graphics, Point } from "pixi.js";
import {
  ELEMENT_RADIUS,
  FISSION_NEUTRON_COUNT,
  GRID_CELL_SIZE,
  INERT_COLOR,
  INERT_TYPE,
  URANIUM_TYPE,
} from "./constants";
import { Neutron } from "./Neutron";

export class Element {
  constructor(type, color, app, grid) {
    this.type = type;
    this.color = color;
    this.app = app;
    this.grid = grid;
    this.gfx = new Graphics();
    this.isFissionable = () => this.type === URANIUM_TYPE;
    this.radius = ELEMENT_RADIUS;
    this.globalPosition = null;

    this.gfx.interactive = true;

    this.init();
  }

  draw() {
    this.gfx.clear();
    this.gfx.circle(0, 0, this.radius).fill({ color: this.color });
  }

  bindEvents() {
    this.gfx.on("pointerdown", () => {
      this.handleFission();
    });
  }

  handleFission() {
    this.changeElement(INERT_TYPE, INERT_COLOR);
    this.fireNeutrons(FISSION_NEUTRON_COUNT);
  }

  fireNeutrons(quantity) {
    const globalPos = this.gfx.toGlobal(new Point(this.gfx.x, this.gfx.y));

    for (let i = 0; i < quantity; i++) {
      new Neutron(
        globalPos.x - GRID_CELL_SIZE / 2,
        globalPos.y - GRID_CELL_SIZE / 2,
        this.app,
        this.grid
      );
    }
  }

  changeElement(type, color) {
    this.type = type;
    this.color = color;

    this.draw();
  }

  init() {
    this.draw();
    this.bindEvents();
  }
}
