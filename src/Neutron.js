import { Particle } from "pixi.js";
import { NEUTRON_RADIUS, NEUTRON_SPEED } from "./constants";

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

  // Update the neutron's position based on its speed and direction
  update() {
    // Update the neutron's position
    this.x += Math.cos(this.direction) * this.speed;
    this.y += Math.sin(this.direction) * this.speed;
    // Update the particle position
    this.particle.x = this.x;
    this.particle.y = this.y;
  }
}
