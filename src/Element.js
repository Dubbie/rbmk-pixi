import { Graphics } from "pixi.js";
import { ELEMENT_RADIUS } from "./constants";

export class Element {
  constructor(type, color, grid) {
    this.type = type;
    this.color = color;
    this.grid = grid;
    this.gfx = new Graphics();
    this.elementRadius = ELEMENT_RADIUS;

    this.init();
  }

  drawElement() {
    this.gfx.clear();
    this.gfx.circle(0, 0, this.elementRadius).fill({ color: this.color });
  }

  init() {
    this.drawElement();
  }
}
