import { Application, Assets, Graphics } from "pixi.js";
import { createFpsCounter } from "./fpsCounter.js";
import { Simulation } from "./Simulation.js";
import { NEUTRON_RADIUS } from "./constants.js";

// Create a PixiJS application.
const app = new Application();

// Asynchronous IIFE
(async () => {
  // Initialize the application.
  await app.init({ background: "#ffffff", resizeTo: window, antialias: true });

  document.body.appendChild(app.canvas);

  // Make the neutron circle
  const circle = new Graphics();
  circle.circle(0, 0, NEUTRON_RADIUS).fill({ color: 0x000000 });

  // Make a texture for the neutron
  // Try-catch for generateTexture
  let circleTexture;
  try {
    circleTexture = app.renderer.generateTexture(circle);
    console.log("Texture generated.");
  } catch (error) {
    console.error("Error generating texture:", error);
  }

  // Create FPS counter
  createFpsCounter(app);

  // Create simulation
  const simulation = new Simulation(app, circleTexture);

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
