import { Graphics } from "pixi.js";
import { ELEMENT_RADIUS, ELEMENTS } from "./constants";

export class Element {
  constructor(typeDef, x, y) {
    this.type = typeDef.type;
    this.color = typeDef.color;
    this.x = x;
    this.y = y;
    this.radius = ELEMENT_RADIUS;
    this.isFissionable = () => this.type === ELEMENTS.URANIUM.type;

    // Create a PixiJS graphics object for rendering
    this.graphics = new Graphics();
    this.graphics.x = x;
    this.graphics.y = y;
    this.draw();
  }

  draw() {
    this.graphics.clear();
    this.graphics.circle(0, 0, this.radius);
    this.graphics.fill({ color: this.color });
  }

  changeElement(newTypeDef) {
    this.type = newTypeDef.type;
    this.color = newTypeDef.color;
    this.draw();
  }
}
