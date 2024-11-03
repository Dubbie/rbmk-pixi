import { Howl, Howler } from "howler";

const DEFAULT_VOLUME = 0.5;
const SOUND_NAMES = {
  FISSION: "fission",
};

const tickSound = new URL("~src/assets/sounds/tick.wav", import.meta.url).href;

class SoundManager {
  constructor(app) {
    this.app = app;
    this.sounds = {};

    this._init();
  }

  load(name, src) {
    console.log("Loading sound: ", name, src);

    this.sounds[name] = new Howl({
      src: [src],
      volume: DEFAULT_VOLUME,
      onload: () => {
        console.log(`Sound "${name}" loaded successfully.`);
      },
      onloaderror: (e) => {
        console.warn(`Failed to load sound: "${name}"`);
      },
      onplayerror: () => {
        console.warn(`Failed to play sound: "${name}"`);
      },
    });
  }

  play(name) {
    if (this.sounds[name]) {
      this.sounds[name].play();
    } else {
      console.warn(`Sound "${name}" not found.`);
    }
  }

  stop(name) {
    if (this.sounds[name]) {
      this.sounds[name].stop();
    }
  }

  setVolume(volume) {
    Howler.volume(volume); // Volume range is 0.0 to 1.0
  }

  _setupUserGesture() {
    // This will resume the AudioContext when the user clicks anywhere on the stage
    this.app.stage.interactive = true;
    this.app.stage.on("pointerdown", this._handleUserInteraction.bind(this));
  }

  _handleUserInteraction() {
    if (!this.sounds[SOUND_NAMES.FISSION]) {
      this.load(SOUND_NAMES.FISSION, tickSound);
    }
  }

  _init() {
    this._setupUserGesture();
  }
}

export default SoundManager;
