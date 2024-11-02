import { Application, Text } from "pixi.js";
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

  // Create an FPS Counter
  const fpsCounter = new Text({
    text: "FPS: 0",
    style: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0x000000,
      align: "center",
    },
  });

  fpsCounter.position.set(app.screen.width / 2, 10);

  app.ticker.add(() => {
    fpsCounter.text = `FPS: ${app.ticker.FPS.toFixed(2)}`;
  });

  app.stage.addChild(fpsCounter);
})();
