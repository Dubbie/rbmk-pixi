import { Graphics, Point } from "pixi.js";
import { ELEMENT_RADIUS, INERT_COLOR, INERT_TYPE } from "./constants";
import { Neutron } from "./Neutron";

export class Element {
  constructor(type, color, grid, row, col) {
    this.type = type;
    this.color = color;
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.gfx = new Graphics();
    this.elementRadius = ELEMENT_RADIUS;

    this.gfx.interactive = true;

    this.init();
  }

  draw() {
    this.gfx.clear();
    this.gfx.circle(0, 0, this.elementRadius).fill({ color: this.color });
  }

  bindEvents() {
    this.gfx.on("pointerdown", () => {
      console.log(`Element clicked at row: ${this.row}, col: ${this.col}`);
      this.handleFission();
    });
  }

  handleFission() {
    this.changeElement(INERT_TYPE, INERT_COLOR);
    this.fireNeutrons(3);
  }

  fireNeutrons(quantity) {
    console.log("Firing neutrons");
    console.log("Current global position:");

    const globalPos = this.gfx.toGlobal(new Point(this.gfx.x, this.gfx.y));

    for (let i = 0; i < quantity; i++) {
      new Neutron(globalPos.x, globalPos.y, this.grid);
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
