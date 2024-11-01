import { Graphics, Point } from "pixi.js";
import {
  INERT_COLOR,
  INERT_TYPE,
  NEUTRON_RADIUS,
  NEUTRON_SPEED,
} from "./constants";
import { Element } from "./grid";

export class Neutron extends Graphics {
  constructor(app, grid, startX, startY) {
    super();

    this.app = app; // Reference to the PIXI application
    this.grid = grid;
    this.speed = NEUTRON_SPEED; // Speed of the neutron
    this.direction = this.getRandomDirection(); // Get a random direction
    this.isDestroyed = false;

    console.log("Neutron created. Position:");
    console.log("- x: ", startX);
    console.log("- y: ", startY);

    // Set the neutron's position
    this.position.set(startX, startY);

    // Draw the neutron
    this.drawNeutron();

    // Add neutron to the stage
    this.app.stage.addChild(this);

    // Start the update loop
    this.update();
  }

  // Method to draw the neutron
  drawNeutron() {
    this.clear();
    this.circle(0, 0, NEUTRON_RADIUS).fill(0x232323);
  }

  // Method to update the neutron's position
  update() {
    if (this.isDestroyed) return;

    // Move the neutron in the current direction
    this.x += this.direction.x * this.speed;
    this.y += this.direction.y * this.speed;

    // Check if the neutron is out of bounds
    if (this.isOutOfBounds()) {
      console.log("Neutron destroyed, going out of bounds!");
      this.destroyNeutron(); // Destroy the neutron if it's out of bounds
      return; // Exit to avoid further updates
    }

    this.checkCollisions();

    // Request the next animation frame
    requestAnimationFrame(() => this.update());
  }

  // Method to check for collisions with uranium cells
  checkCollisions() {
    // Get bounding box of the neutron
    const neutronBounds = this.getBounds();

    // Loop through each uranium cell and check for collisions
    this.grid.getUraniumCells().forEach((cell) => {
      const cellBounds = cell.getBounds(); // Get bounding box of the cell

      // Manual check for intersection between neutron and cell bounding boxes
      const isIntersecting =
        neutronBounds.x < cellBounds.x + cellBounds.width &&
        neutronBounds.x + neutronBounds.width > cellBounds.x &&
        neutronBounds.y < cellBounds.y + cellBounds.height &&
        neutronBounds.y + neutronBounds.height > cellBounds.y;

      if (isIntersecting) {
        this.handleCollision(cell); // Handle the collision if there's an intersection
      }
    });
  }

  // Method to handle a collision with a uranium cell
  handleCollision(cell) {
    console.log("Neutron hit a Uranium cell!");

    cell.replaceElement(new Element(INERT_TYPE, INERT_COLOR));

    const centerX = cell.x + cell.size / 2; // Use the local position
    const centerY = cell.y + cell.size / 2;

    const globalCenter = cell.toGlobal(new Point(centerX, centerY));

    // Calculate the center position of the cell
    console.log("Should fire here.");
    console.log("x:" + globalCenter.x);
    console.log("y:" + globalCenter.y);

    // Fire three new neutrons from the center of the cell
    this.fireNeutrons(globalCenter.x, globalCenter.y);

    this.destroyNeutron();
  }

  // Fire neutrons from a specified location
  fireNeutrons(startX, startY) {
    for (let i = 0; i < 3; i++) {
      new Neutron(this.app, this.grid, startX, startY);
    }
  }

  // Method to check if the neutron is out of bounds
  isOutOfBounds() {
    const halfRadius = NEUTRON_RADIUS;

    return (
      this.x < -halfRadius ||
      this.x > this.app.screen.width + halfRadius ||
      this.y < 0 ||
      this.y > this.app.screen.height + halfRadius
    );
  }

  // Method to get a random direction
  getRandomDirection() {
    const angle = Math.random() * 2 * Math.PI; // Random angle
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  // Method to destroy the neutron
  destroyNeutron() {
    this.isDestroyed = true;

    if (this.parent) {
      this.parent.removeChild(this); // Remove from parent
    }
    super.destroy(); // Call the parent destroy method
  }
}
