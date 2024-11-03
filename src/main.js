import { Application } from "pixi.js";
import { createFpsCounter } from "src/utils/fpsCounter.js";
import { Simulation } from "src/components/Simulation.js";
import { createNeutronTexture } from "src/utils/neutron.js";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Initialize the application.
  await app.init({ background: "#282828", resizeTo: window, antialias: true });

  document.body.appendChild(app.canvas);

  // Make the neutron circle
  const neutronTexture = createNeutronTexture(app);

  // Create FPS counter
  createFpsCounter(app);

  // Create simulation
  const simulation = new Simulation(app, neutronTexture);

  // Start loop
  app.ticker.add((delta) => {
    simulation.update(delta);
  });
})();
