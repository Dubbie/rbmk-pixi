import { Application } from "pixi.js";
import { createFpsCounter } from "./fpsCounter.js";
import { Simulation } from "./Simulation.js";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Initialize the application.
  await app.init({ background: "#ffffff", resizeTo: window, antialias: true });

  document.body.appendChild(app.canvas);

  // Create FPS counter
  createFpsCounter(app);

  // Create simulation
  const simulation = new Simulation(app);

  // Start the game loop
  app.ticker.add(() => {
    simulation.update();
  });

  app.canvas.addEventListener("click", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;

    const nearbyElements = simulation.spatialHash.getNearbyElements(x, y);
    for (const element of nearbyElements) {
      if (
        simulation.checkCollision(
          { x, y },
          { x: element.globalPosition.x, y: element.globalPosition.y }
        )
      ) {
        simulation.handleFission(element);
        break; // Stop checking other elements if a collision is detected
      }
    }
  });
})();
