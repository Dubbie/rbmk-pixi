import { Container, ParticleContainer, Point, Text } from "pixi.js";
import {
  ELEMENT_RADIUS,
  ELEMENTS,
  FISSION_NEUTRON_COUNT,
  GRID_COLS,
  GRID_GAP,
  GRID_RICHNESS,
  GRID_ROWS,
  SPATIAL_HASH_BUCKET_SIZE,
} from "~/src/constants.js";
import { Element } from "~/src/components/Element.js";
import SpatialHash from "~/src/components/SpatialHash.js";
import { Neutron } from "~/src/components/Neutron.js";

export class Simulation {
  constructor(app, neutronTexture) {
    this.app = app;
    this.neutronTexture = neutronTexture;
    this.neutrons = [];
    this.elements = [];
    this.controlRods = [];
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
    this.spatialHash = new SpatialHash(SPATIAL_HASH_BUCKET_SIZE);
    this.neutronCounter = new Text({
      text: "Neutrons: 0",
      style: {
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffffff,
        align: "center",
      },
    });

    this.app.stage.addChild(this.container);
    this.app.stage.addChild(this.neutronContainer);

    this.init();
  }

  _addElement(typeDef, x, y) {
    const element = new Element(typeDef, x, y, this);
    this.elements.push(element);
    this.container.addChild(element.graphics);
  }

  createGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * (this.elementRadius * 2 + this.gap);
        const y = row * (this.elementRadius * 2 + this.gap);
        const isUranium = Math.random() < this.richness;
        const elementTypeDef = isUranium ? ELEMENTS.URANIUM : ELEMENTS.INERT;
        this._addElement(elementTypeDef, x, y);
      }
    }
  }

  centerContainer() {
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;

    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }

  updateSpatialHash() {
    this.spatialHash = new SpatialHash(SPATIAL_HASH_BUCKET_SIZE);
    this.elements.forEach((element) => {
      this.spatialHash.insert(element);
    });
  }

  addGlobalPositions() {
    this.elements.forEach((element) => {
      element.globalPosition = element.graphics.toGlobal(new Point(0, 0));
    });
  }

  handleFission(element) {
    // Don't collide with non fissionable
    if (!element.isFissionable()) return;

    // Become inert
    element.changeElement(ELEMENTS.INERT);

    // Get the global position of our element
    const globalPosition = element.graphics.toGlobal(
      new Point(-element.graphics.width / 4, -element.graphics.height / 4)
    );

    // Fire 3 neutrons.
    for (let i = 0; i < FISSION_NEUTRON_COUNT; i++) {
      const neutron = new Neutron(
        this.neutronTexture,
        globalPosition.x,
        globalPosition.y
      );
      this.neutrons.push(neutron);
      this.neutronContainer.addParticle(neutron.particle);
    }
  }

  update(delta) {
    // Update neutron counter
    this.neutronCounter.text = `Neutrons: ${this.neutrons.length}`;

    this.neutrons.forEach((neutron) => {
      const neutronCenterPoint = neutron.getCenterPoint();

      // Remove if out of bounds
      if (
        neutron.x + neutron.radius < 0 ||
        neutron.x > this.app.screen.width ||
        neutron.y < 0 ||
        neutron.y + neutron.radius > this.app.screen.height
      ) {
        this.neutronContainer.removeParticle(neutron.particle);
        this.neutrons.splice(this.neutrons.indexOf(neutron), 1);
        return;
      }

      // Check for collisions
      const nearbyElements = this.spatialHash.getNearbyElements(
        neutron.particle.x + neutron.radius / 2,
        neutron.particle.y + neutron.radius / 2
      );
      for (const element of nearbyElements) {
        const elementCenterPoint = {
          x: element.globalPosition.x,
          y: element.globalPosition.y,
        };
        if (
          this.checkCircleCollision(
            neutronCenterPoint,
            elementCenterPoint,
            neutron.radius,
            element.radius
          )
        ) {
          if (element.isFissionable()) {
            this.handleFission(element);

            // Remove the neutron
            this.neutronContainer.removeParticle(neutron.particle);
            this.neutrons.splice(this.neutrons.indexOf(neutron), 1);

            break; // Stop checking other elements if a collision is detected
          }
        }
      }

      // Move the neutron
      neutron.update(delta);
    });
  }

  // Both points should be the center of the objects.
  checkCircleCollision(a, b, aRadius, bRadius) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < aRadius + bRadius;
  }

  drawNeutronCounter() {
    this.neutronCounter.position.set(this.app.screen.width / 2, 40);
    this.app.stage.addChild(this.neutronCounter);
  }

  init() {
    this.createGrid();
    this.centerContainer();
    this.addGlobalPositions();
    this.updateSpatialHash();
    this.drawNeutronCounter();
  }
}
