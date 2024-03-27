import Phaser from "phaser";
import ChessScene from "./scenes/ChessScene.js";

function initializeAudioContext() {
  if (game.sound.context.state === "suspended") {
    game.sound.context
      .resume()
      .then(() => {
        console.log("AudioContex resumed");
      })
      .catch((error) => {
        console.log("Failed to resume");
      });
  }
}

document.addEventListener("click", initializeAudioContext);
const config = {
  type: Phaser.AUTO,
  parent: "app",
  height: 640,
  width: 360,
  backgroundColor: "#000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: ChessScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

export default game;
