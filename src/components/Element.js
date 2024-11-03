import { Graphics, Point } from "pixi.js";
import { ELEMENT_RADIUS, ELEMENTS } from "src/constants";
import gsap from "gsap";

export class Element {
  constructor(typeDef, x, y, simulation) {
    this.type = typeDef.type;
    this.color = typeDef.color;
    this.x = x;
    this.y = y;
    this.simulation = simulation;
    this.radius = ELEMENT_RADIUS;
    this.isFissionable = () => this.type === ELEMENTS.URANIUM.type;

    // Create a PixiJS graphics object for rendering
    this.graphics = new Graphics();
    this.graphics.interactive = true;
    this.graphics.x = this.x;
    this.graphics.y = this.y;

    this.graphics.on("pointerdown", () => {
      this.simulation.handleFission(this);

      console.log(
        "Global position of element: ",
        this.graphics.toGlobal(new Point(0, 0))
      );
    });

    this.draw();
  }

  draw() {
    this.graphics.clear();
    this.graphics.circle(0, 0, this.radius);
    this.graphics.fill({ color: this.color });
  }

  animateColorChange(newColor, duration = 0.2) {
    const colorObj = { color: this.color };

    gsap.to(colorObj, {
      duration,
      color: newColor,
      onUpdate: () => {
        this.graphics.clear();
        this.graphics.circle(0, 0, this.radius);
        this.graphics.fill(colorObj);
      },
      ease: "power1.inOut",
    });
  }

  changeElement(newTypeDef) {
    this.type = newTypeDef.type;
    this.animateColorChange(newTypeDef.color);

    this.draw();
  }
}
