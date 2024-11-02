# RBMK Simulation

A simulation of a nuclear fission chain reaction using [Pixi.JS](https://pixijs.com/) and [Parcle](https://parceljs.org/). This project visualizes a dynamic grid of fissionable elements that react when triggered by a neutron collision. Clicking a blue circle initiates the chain reaction.

## Getting Started

### Prerequisites

- Node.js (Tested on v20)
- npm (comes with Node.js)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/Dubbie/rbmk-pixi.git
   cd rbmk-pixi
   ```

2. Run the project

   ```
   npm start
   ```

   This will start a development server, and you should be able to access the simulation at `http://localhost:46497/`

## Usage

1. Open the simulation in your browser
2. Click on a **blue circle** to start the fission chain reaction.
3. Watch as neutrons are emitted and collide with other fissionable elements, propogating the reaction.

## Project structure

- `src/` - Contains the source code, including main simulation logic, element definitions and helper classes like `SpatialHash` for optimized? collision detection.
- `constants.js` - Defines configuration values like element radius, grid size etc.
- `Neutron.js`,`Element.js`,`Simulation.js` - Core classes for managing elements, neutrons and the simulation itself.
