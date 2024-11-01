import { Application } from "pixi.js";
import { Grid } from "./grid";
import { GRID_COLS, GRID_ROWS } from "./constants";
import { Neutron } from "./Neutron";

// Asynchronous IIFE
(async () => {
  // Create a PixiJS application.
  const app = new Application();
  const gap = 5;

  // Intialize the application.
  await app.init({ background: "#ffffff", resizeTo: window, antialias: true });

  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);

  const grid = new Grid(GRID_ROWS, GRID_COLS, 10, gap, 0.2);
  grid.addToStage(app.stage);

  // Make the stage interactive
  app.stage.interactive = true;

  // Listen for click events on the whole application stage
  app.canvas.addEventListener("pointerdown", (event) => {
    fireNeutron(event.offsetX, event.offsetY);
  });

  function fireNeutron(x, y) {
    console.log("Firing new neutron!");
    new Neutron(app, grid, x, y);
  }
})();
