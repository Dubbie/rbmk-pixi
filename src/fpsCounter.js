import { Text } from "pixi.js";

export function createFpsCounter(app) {
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
    fpsCounter.text = `FPS: ${Math.floor(app.ticker.FPS)}`;
  });

  app.stage.addChild(fpsCounter);
}
