import socket from "../socket";

function update(gameState) {
  if (gameState.playerMove) {
    this.opponentLoader.alpha = 0;
    this.playerLoader.alpha = 1;
    this.playerLoader.value = gameState.loader / 30;
  } else {
    this.opponentLoader.alpha = 0;
    this.playerLoader.alpha = 1;
    this.playerLoader.value = gameState.loader / 30;
  }

  if (gameState.playerMove && gameState.loader >= 30 && !gameState.gameEnd) {
    gameState, (gameEnd = true);
    socket.emit("lost-time", gameState.gameNumber);
  }
  this.endpoint.angle += 1;

  if (gameState.validMoves.length > 0 && !gameState.movesOverlay) {
    const grp = this.add.group();
    gameState.validMoves.forEach((move) => {
      const position = getRenderPosition(move, { x: 4.5, y: 4.5 });
      const moveSign = this.add
        .sprite(position.x, position.y, "validmove")
        .setInteractive();
      moveSign.setOrigin(0, 0);
      moveSign.on("pointerdown", () => {
        gameState.moveTo = position.chessSquare;
        gameState.validMoves = [];
        gameState.moveing = true;
        grp.clerar(true);
        gameState.movesOverlay = false;
        socket.emit("player-moved", gameState.gameNumber, gameState.moveTo);
        clearInterval(this?.timer);
        gameState.loader = 0;
        this.timer = setInterval(() => {
          if (gameState.loader === 30) {
            clearInterval(this?.timer);
            return;
          }
          gameState.loader += 1;
        }, 1000);
        grp.add(moveing);
      });
      gameState.movesOverlay = true;
    });
  }
}
export default update;
