import { Graphics, Point, Ticker } from "pixi.js";
import {
  ELEMENT_RADIUS,
  GRID_CELL_SIZE,
  NEUTRON_RADIUS,
  NEUTRON_SPEED,
} from "./constants";

export class Neutron {
  constructor(x, y, app, grid) {
    this.gfx = new Graphics();
    this.gfx.x = x;
    this.gfx.y = y;
    this.app = app;
    this.grid = grid;
    this.speed = NEUTRON_SPEED;
    this.radius = NEUTRON_RADIUS;
    this.destroyed = false;
    this.ticker = new Ticker();

    // Generate a random angle (in radians) for the direction
    this.direction = Math.random() * Math.PI * 2;

    // Add the gfx to the stage
    this.app.stage.addChild(this.gfx);

    this.init();
  }

  draw() {
    this.gfx.circle(0, 0, this.radius).fill({ color: 0x232323 });
  }

  move(time) {
    if (this.destroyed) return;

    // Calculate the change in x and y based on the direction and speed
    const dx = Math.cos(this.direction) * this.speed * time.deltaTime;
    const dy = Math.sin(this.direction) * this.speed * time.deltaTime;

    // Update the neutron's position
    this.gfx.x += dx;
    this.gfx.y += dy;

    // const globalPos = this.gfx.toGlobal(new Point(this.gfx.x, this.gfx.y));
    const element = this.grid.getElementByGlobalPosition(
      this.gfx.x,
      this.gfx.y
    );

    if (element && element.isFissionable()) {
      if (!element.globalPosition) {
        element.globalPosition = element.gfx.toGlobal(new Point(0, 0));
      }

      const neutronPos = {
        x: this.gfx.x,
        y: this.gfx.y,
      };

      // Calculate the distance between the centers
      const dx = neutronPos.x - element.globalPosition.x;
      const dy = neutronPos.y - element.globalPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius + element.radius + GRID_CELL_SIZE / 2) {
        // Handle the collision, e.g., destroy neutron, affect the element, etc.
        element.handleFission();
        this.destroy();
        return;
      }
    }

    // Check bounds
    if (this.isOutOfBounds()) {
      this.destroy();
    }
  }

  isOutOfBounds() {
    // Get the app's viewport dimensions
    const { width, height } = this.app.renderer.screen;

    // Check if the neutron is outside the bounds
    return (
      this.gfx.x < -NEUTRON_RADIUS ||
      this.gfx.x > width + NEUTRON_RADIUS ||
      this.gfx.y < -NEUTRON_RADIUS ||
      this.gfx.y > height + NEUTRON_RADIUS
    );
  }

  destroy() {
    // Remove the neutron's graphics from the stage
    this.gfx.destroy();

    this.ticker.destroy();
  }

  init() {
    this.draw();

    this.ticker.add((delta) => {
      this.move(delta);
    });
    this.ticker.start();
  }
}
