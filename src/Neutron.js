import { Graphics } from "pixi.js";
import { NEUTRON_RADIUS, NEUTRON_SPEED } from "./constants";

export class Neutron {
  constructor(x, y) {
    this.x = x; // Current x position
    this.y = y; // Current y position
    this.radius = NEUTRON_RADIUS; // Radius for drawing the neutron
    this.speed = NEUTRON_SPEED; // Speed of the neutron
    this.direction = Math.random() * Math.PI * 2; // Direction of the neutron

    // Create a graphics object to represent the neutron visually
    this.graphics = new Graphics();
    this.graphics.circle(0, 0, this.radius).fill({ color: 0x232323 });

    // Set the initial position of the neutron
    this.graphics.x = this.x;
    this.graphics.y = this.y;
  }

  // Update the neutron's position based on its speed and direction
  update() {
    // Update the neutron's position
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;

    // Update the graphics position
    this.graphics.x = this.x;
    this.graphics.y = this.y;
  }
}
