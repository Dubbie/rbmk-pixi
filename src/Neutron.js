import { Graphics, Ticker } from "pixi.js";
import { NEUTRON_RADIUS, NEUTRON_SPEED } from "./constants";

export class Neutron {
  constructor(x, y, grid) {
    this.gfx = new Graphics();
    this.gfx.x = x;
    this.gfx.y = y;
    this.grid = grid;
    this.speed = NEUTRON_SPEED;
    this.radius = NEUTRON_RADIUS;
    this.destroyed = false;
    this.ticker = new Ticker();

    // Generate a random angle (in radians) for the direction
    this.direction = Math.random() * Math.PI * 2;

    // Add the gfx to the stage
    this.grid.app.stage.addChild(this.gfx);

    this.init();
  }

  draw() {
    this.gfx.clear();
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

    // Check bounds
    if (this.isOutOfBounds()) {
      this.destroy();
    }
  }

  isOutOfBounds() {
    // Get the app's viewport dimensions
    const { width, height } = this.grid.app.renderer.screen;

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

    console.log("Neutron has been destroyed.");
  }

  init() {
    this.draw();

    this.ticker.add((delta) => {
      this.move(delta);
    });
    this.ticker.start();
  }
}
