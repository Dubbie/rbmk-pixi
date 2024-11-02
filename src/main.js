import { Application } from "pixi.js";
import { ReactorGrid } from "./ReactorGrid";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Initialize the application.
  await app.init({ background: "#ffffff", resizeTo: window, antialias: true });

  document.body.appendChild(app.canvas);

  // Create the ReactorGrid
  new ReactorGrid(app);
})();
