import { Application, Container, Graphics } from "pixi.js";
import { ReactorGrid } from "./ReactorGrid";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Initialize the application.
  await app.init({ background: "#ffffff", resizeTo: window, antialias: true });

  document.body.appendChild(app.canvas);

  // Create the ReactorGrid
  const grid = new ReactorGrid(app);

  app.stage.interactive = true;
  app.stage.on("pointerdown", (e) => {
    const { x, y } = e.global;

    grid.getGridPositionByGlobalPosition(x, y);
  });
})();
