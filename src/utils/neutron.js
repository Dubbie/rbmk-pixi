import { NEUTRON_COLOR, NEUTRON_RADIUS } from "~/src/constants.js";
import { Graphics } from "pixi.js";

export function createNeutronTexture(app) {
  // Make the neutron circle
  const circle = new Graphics();
  circle.circle(0, 0, NEUTRON_RADIUS).fill({ color: NEUTRON_COLOR });

  // Make a texture for the neutron
  let circleTexture;
  try {
    circleTexture = app.renderer.generateTexture(circle);
  } catch (error) {
    console.error("Error generating texture:", error);

    return null;
  }

  return circleTexture;
}
