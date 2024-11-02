import { Graphics, GraphicsContext } from "pixi.js";

export class Neutron {
  constructor(app, x, y, grid, onCollision) {
    this.app = app;
    this.graphics = new Graphics();
    this.x = x;
    this.y = y;
    this.grid = grid;
    this.onCollision = onCollision;
    this.speed = 2; // Speed of neutron movement
    this.direction = this.randomDirection();
    this.draw();
    this.move();
  }

  randomDirection() {
    const angle = Math.random() * Math.PI * 2; // Random angle
    return {
      dRow: Math.round(Math.sin(angle)),
      dCol: Math.round(Math.cos(angle)),
    };
  }

  draw() {
    this.graphics.clear(); // Clear previous graphics
    this.graphics.beginFill(0x232323); // Fill color for neutron
    this.graphics.drawCircle(this.x, this.y, 5); // Draw the neutron
    this.graphics.endFill();

    // If not already added, add the neutron to the stage
    if (!this.graphics.parent) {
      this.app.stage.addChild(this.graphics);
    }
  }

  move() {
    const interval = setInterval(() => {
      this.x += this.direction.dCol * this.speed;
      this.y += this.direction.dRow * this.speed;
      this.draw(); // Redraw the neutron in the new position

      // Calculate the current grid position of the neutron
      const currentRow = Math.floor(this.y / 20);
      const currentCol = Math.floor(this.x / 20);

      // Check for collision with Uranium
      if (this.isInBounds(currentRow, currentCol)) {
        if (this.grid[currentRow][currentCol] === "U") {
          this.onCollision(currentRow, currentCol); // Notify grid about the collision
          clearInterval(interval); // Stop moving the neutron
        }
      } else {
        clearInterval(interval); // Stop if out of bounds
      }
    }, 100); // Move neutron every 100 ms
  }

  isInBounds(row, col) {
    return (
      row >= 0 &&
      row < this.grid.length &&
      col >= 0 &&
      col < this.grid[0].length
    );
  }
}
