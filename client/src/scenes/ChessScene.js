import Phaser from "phaser";
import socket from "../../socket.js";

import create from "./create.js";
import preload from "./preload.js";
import update from "./update.js";

const ChessScene = new Phaser.Scene();

const gameState = {
  gameNumber: null,
  playerMove: true,
  currentPosition: 8,
  validMoves: [],
  moveTo: 8,
  moving: false,
  movesOverlay: false,
  gameEnd: false,
  isWinner: null,
  loader: 0,
};

ChessScene.preload = preload.bind(ChessScene, gameState);
ChessScene.create = create.bind(ChessScene, gameState);
ChessScene.update = update.bind(ChessScene, gameState);
ChessScene.timer = null;

socket.on("ready", (payload) => {
  gameState.gameNumber = payload.gameNumber;
  gameState.playerMove = payload.playerMove;

  gameState.loader = 0;
  ChessScene.timer = setInterval(() => {
    if (gameState.loader === 30) {
      clearInterval(ChessScene?.timer);
      return;
    }
    gameState.loader += 1;
  }, 1000);
  socket.off("ready");
});

socket.on("opponent-moved", (moveTo) => {
  gameState.moveTo = moveTo;
  gameState.moving = true;

  clearInterval(ChessScene?.timer);
  gameState.loader = 0;
  ChessScene.timer = setInterval(() => {
    if (gameState.loader === 30) {
      clearInterval(ChessScene?.timer);
      return;
    }
    gameState.loader += 1;
  }, 1000);
});

socket.on("ready-next-move", (move) => {
  gameState.playerMove = move.playerMove;
});

socket.on("win", (winnerId) => {
  gameState.gameEnd = true;
  gameState.isWinner = winnerId === socket.id;
  clearInterval(ChessScene?.timer);
});

export default ChessScene;
