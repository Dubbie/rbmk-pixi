import { Container, ParticleContainer } from "pixi.js";
import {
  ELEMENT_RADIUS,
  ELEMENTS,
  FISSION_NEUTRON_COUNT,
  GRID_COLS,
  GRID_GAP,
  GRID_RICHNESS,
  GRID_ROWS,
  NEUTRON_RADIUS,
} from "./constants.js";
import { Element } from "./Element.js";
import SpatialHash from "./SpatialHash.js";
import { Neutron } from "./Neutron.js";

export class Simulation {
  constructor(app, neutronTexture) {
    this.app = app;
    this.neutronTexture = neutronTexture;
    this.neutrons = [];
    this.elements = [];
    this.container = new Container();
    this.elementRadius = ELEMENT_RADIUS;
    this.gap = GRID_GAP;
    this.cols = GRID_COLS;
    this.rows = GRID_ROWS;
    this.richness = GRID_RICHNESS;
    this.neutronContainer = new ParticleContainer({
      dynamicProperties: {
        position: true, // Allow dynamic position changes (default)
        scale: false, // Static scale for extra performance
        rotation: false, // Static rotation
        color: false, // Static color
      },
    });
    this.spatialHash = new SpatialHash(NEUTRON_RADIUS * 2);

    this.app.stage.addChild(this.container);
    this.app.stage.addChild(this.neutronContainer);

    this.init();
  }

  addElement(typeDef, x, y) {
    const element = new Element(typeDef, x, y);
    this.elements.push(element);
    this.container.addChild(element.graphics); // Add to PixiJS stage
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * this.elementRadius * 2;
        const y = row * this.elementRadius * 2;
        const isUranium = Math.random() < this.richness;
        const elementTypeDef = isUranium ? ELEMENTS.URANIUM : ELEMENTS.INERT;
        this.addElement(elementTypeDef, x, y);
      }
    }
  }

  centerContainer() {
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;

    this.container.pivot.set(
      this.container.width / 2,
      this.container.height / 2
    );
  }

  update() {
    // Update elements and neutrons
    for (const neutron of this.neutrons) {
      // Move neutron
      neutron.update();

      // Check for out of bounds
      if (
        neutron.particle.x < -neutron.radius ||
        neutron.particle.x > this.app.screen.width + neutron.radius ||
        neutron.particle.y < -neutron.radius ||
        neutron.particle.y > this.app.screen.height + neutron.radius
      ) {
        this.neutronContainer.removeParticle(neutron.particle);
        this.neutrons.splice(this.neutrons.indexOf(neutron), 1);
      }

      // Check for collisions
      const nearbyElements = this.spatialHash.getNearbyElements(
        neutron.particle.x,
        neutron.particle.y
      );
      for (const element of nearbyElements) {
        if (
          this.checkCollision(
            { x: neutron.particle.x, y: neutron.particle.y },
            { x: element.globalPosition.x, y: element.globalPosition.y }
          )
        ) {
          this.handleFission(element);
          break; // Stop checking other elements if a collision is detected
        }
      }
    }
  }

  getElementByGlobalPosition(x, y) {
    for (const element of this.elements) {
      const radius = this.elementRadius;
      const centerX = element.globalPosition.x;
      const centerY = element.globalPosition.y;
      const distance = Math.sqrt(
        (centerX - x) * (centerX - x) + (centerY - y) * (centerY - y)
      );
      if (distance < radius) {
        return element;
      }
    }
    return null;
  }

  addGlobalPosition() {
    for (const element of this.elements) {
      element.globalPosition = element.graphics.getGlobalPosition();
    }
  }

  updateSpatialHash() {
    // Clear the existing spatial hash
    this.spatialHash = new SpatialHash(100); // Re-initialize the spatial hash

    // Re-insert all elements into the spatial hash
    for (const element of this.elements) {
      this.spatialHash.insert(element);
    }
  }

  // Define your collision detection logic here
  checkCollision(aPos, bPos) {
    const distanceSquared = (aPos.x - bPos.x) ** 2 + (aPos.y - bPos.y) ** 2;
    return distanceSquared <= this.elementRadius ** 2; // Use the radius for collision detection
  }

  handleFission(element) {
    if (!element.isFissionable()) return;

    element.changeElement(ELEMENTS.INERT);

    // Create new neutrons
    for (let i = 0; i < FISSION_NEUTRON_COUNT; i++) {
      const neutron = new Neutron(
        this.neutronTexture,
        element.globalPosition.x,
        element.globalPosition.y
      );
      this.neutrons.push(neutron);
      this.neutronContainer.addParticle(neutron.particle);
    }
  }

  init() {
    this.createGrid();
    this.centerContainer();
    this.addGlobalPosition();
    this.updateSpatialHash();
  }
}
