import Phaser from "phaser";
import ChessScene from "../src/scenes/ChessScene";
function initializeAudioContext() {
  // Check if the AudioContext is suspended
  if (game.sound.context.state === "suspended") {
    // Attempt to resume the AudioContext
    game.sound.context
      .resume()
      .then(() => {
        console.log("AudioContext resumed successfully.");
      })
      .catch((error) => {
        console.error("Failed to resume AudioContext:", error);
      });
  }
}

// Add an event listener for a user gesture (e.g., click event)
document.addEventListener("click", initializeAudioContext);
// Phaser game configuration
const config = {
  type: Phaser.AUTO,
  parent: "app",
  height: 640,
  width: 360,
  backgroundColor: "#000000",
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

// Initialize the Phaser game with the configuration
const game = new Phaser.Game(config);

export default game;
