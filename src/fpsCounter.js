import { Text } from "pixi.js";

const FPS_KEEP = 60;

export function createFpsCounter(app) {
  let arrFps = [];
  let minFps = Infinity;
  let maxFps = 0;

  // Create an FPS Counter
  const avgFpsCounter = new Text({
    text: "FPS: 999",
    style: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0x000000,
      align: "center",
    },
  });
  const minFpsCounter = new Text({
    text: "Min FPS: 999",
    style: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0x000000,
      align: "center",
    },
  });

  const maxFpsCounter = new Text({
    text: "Max FPS: 999",
    style: {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0x000000,
      align: "center",
    },
  });

  app.stage.addChild(avgFpsCounter);
  app.stage.addChild(minFpsCounter);
  app.stage.addChild(maxFpsCounter);

  avgFpsCounter.position.set(10, 10);
  minFpsCounter.position.set(avgFpsCounter.width + 20, 10);
  maxFpsCounter.position.set(
    avgFpsCounter.width + minFpsCounter.width + 30,
    10
  );

  app.ticker.add(() => {
    // Update min and max FPS
    minFps = Math.min(app.ticker.FPS, minFps);
    maxFps = Math.max(app.ticker.FPS, maxFps);

    // Update average FPS
    arrFps.push(app.ticker.FPS);
    if (arrFps.length > FPS_KEEP) {
      arrFps.shift();
    }

    const averageFps = arrFps.reduce((a, b) => a + b) / arrFps.length;
    avgFpsCounter.text = `FPS: ${Math.floor(averageFps)}`;
    minFpsCounter.text = `Min FPS: ${Math.floor(minFps)}`;
    maxFpsCounter.text = `Max FPS: ${Math.floor(maxFps)}`;
  });
}
