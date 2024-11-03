import { Particle } from "pixi.js";
import { NEUTRON_RADIUS, NEUTRON_SPEED } from "src/constants";

export class Neutron {
  constructor(texture, x, y) {
    this.x = x; // Current x position
    this.y = y; // Current y position
    this.radius = NEUTRON_RADIUS; // Radius for drawing the neutron
    this.speed = NEUTRON_SPEED; // Speed of the neutron
    this.direction = Math.random() * Math.PI * 2; // Direction of the neutron

    // Create a Particle
    this.particle = new Particle({
      texture: texture,
      x: this.x,
      y: this.y,
    });
  }

  getCenterPoint() {
    return { x: this.x + this.radius / 2, y: this.y + this.radius / 2 };
  }

  // Update the neutron's position based on its speed and direction
  update(delta) {
    // Update the neutron's position
    this.x += Math.cos(this.direction) * this.speed * delta.deltaTime;
    this.y += Math.sin(this.direction) * this.speed * delta.deltaTime;
    // Update the particle position
    this.particle.x = this.x;
    this.particle.y = this.y;
  }
}
