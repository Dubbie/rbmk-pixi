import { Graphics } from "pixi.js";
import {
  INERT_TYPE,
  INERT_COLOR,
  URANIUM_COLOR,
  URANIUM_TYPE,
} from "./constants";

export class Element {
  constructor(type, color) {
    this.type = type;
    this.color = color;
  }
}

export class Cell extends Graphics {
  constructor(x, y, size, element) {
    super();

    this.size = size;
    this.x = x + this.size / 2;
    this.y = y + this.size / 2;
    this.element = element;

    this.interactive = false;
    this.buttonMode = false;

    this.drawCell();
  }

  drawCell() {
    const color = this.element.color;

    this.clear();
    this.circle(this.x, this.y, this.size).fill(color);
  }

  replaceElement(newElement) {
    this.element = newElement;
    this.drawCell();
  }

  // Method to mark cell as collided by changing color or applying an effect
  markCollided() {
    this.element.color = 0xff0000; // Change to red (or any color for collided state)
    this.drawCell(); // Redraw to apply the new color
  }
}

export class Grid {
  constructor(rows, cols, cellSize, gap, richness) {
    this.rows = rows; // Number of rows
    this.cols = cols; // Number of columns
    this.gap = gap; // Gap between circles
    this.cellSize = cellSize; // Size of each cell
    this.richness = richness; // Percentage of uranium cells
    this.cells = []; // Array to hold the cells

    this.createGrid(); // Create the grid on initialization
  }

  createGrid() {
    // Loop through the rows and columns to create cells
    for (let row = 0; row < this.rows; row++) {
      this.cells[row] = []; // Initialize the row

      for (let col = 0; col < this.cols; col++) {
        // Determine if the cell should be uranium based on richness
        const isUranium = Math.random() < this.richness;
        let element = new Element(INERT_TYPE, INERT_COLOR);

        if (isUranium) {
          element = new Element(URANIUM_TYPE, URANIUM_COLOR);
        }

        // Calculate the adjusted size for the circle based on the gap
        const adjustedSize = this.cellSize - this.gap;

        // Create a new Cell and push it into the array
        const cell = new Cell(
          col * this.cellSize + this.gap / 2,
          row * this.cellSize + this.gap / 2,
          adjustedSize,
          element,
        );
        this.cells[row].push(cell);
      }
    }
  }

  addToStage(stage) {
    // Add all cells to the Pixi stage
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        stage.addChild(cell);
      });
    });
  }
  // Add this method to your Grid class
  getRandomUraniumCell() {
    const uraniumCells = [];
    this.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.element.type === "uranium") {
          uraniumCells.push(cell);
        }
      });
    });
    return uraniumCells.length > 0
      ? uraniumCells[Math.floor(Math.random() * uraniumCells.length)]
      : null;
  }

  getUraniumCells() {
    return this.cells.flat().filter((cell) => cell.element.type === "uranium");
  }

  updateCellToInert(cell) {
    cell.element = new Element("inert", 0x232323); // Change element to inert
    cell.drawCell(); // Redraw the cell to reflect the change
  }
}
