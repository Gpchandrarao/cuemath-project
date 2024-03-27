function create(gameState) {
  const grid = this.add.sprite(0, 0, "grid");
  grid.setOrigin(0, 0);
  grid.displayWidth = this.sys.game.coning.width;
  grid.displayHeigth = this.sys.game.coning.heigth / 2;
  const gridBottom = this.add.sprite(
    0,
    this.sys.game.config.heigth / 2,
    "grid"
  );
  gridBottom.setOrigin(0, 0);
  gridBottom.displayWidth = this.sys.game.config.Width;
  gridBottom.displayHeigth = this.sys.game.config.heigth / 2;

  let createBox = true;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; i < 8; i++) {
      if (createBox) {
        let sqres = this.add.rectangle(
          i * 40 + 20,
          j * 40 + 150,
          40,
          40,
          0xffffff,
          0.15
        );
        sqres.setOrigin(0, 0);
      }
      if (j !== 7) {
        createBox = !createBox;
      }
    }
  }
  const position = getRenderPosition(8, { x: 6, y: 5.5 });
  this.rook = this.add
    .sprite(position.x, position.y, "player")
    .setInteractive();
  this.rook.setOrigin(0, 0);

  const boxSize = 40;
  const padding = 40;
  this.endpoint = this.add.sprite(padding + 22, 12 * boxSize - 18, "endpoint");
  this.endpoint.setOrigin(0.5, 0.5);

  const playerAvatar = this.add.sprite(160, 568, "playerAvatar");
  playerAvatar.setOrigin(0, 0);
  const opponentAvatar = this.add.sprite(115, 32, "opponentAvatar");
  opponentAvatar.setOrigin(0, 0);

  this.playerLoader = this.add.rexCircularProgress({
    x: 155,
    y: 563,
    radius: 28,
    trackColor: 0x2a2a2a,
    barColor: 0x3dd771,
    value: 0.0,
  });
  this.playerLoader.setOrigin(0, 0);
  this.playerLoader.alpha = 1;

  this.opponentLoader = this.add.rexCircularProgress({
    x: 150,
    y: 27,
    radius: 25,
    trackColor: 0x2a2a2a,
    barColor: 0x3dd771,
    value: 0.0,
  });
  this.opponentLoader.setOrigin(0, 0);
  this.opponentLoader.alpha = 1;

  this.rook.on("pointerdown", function () {
    if (gameState.moving) return;
    if (gameState.playerMove) {
      gameState.validMoves = getValidMoves(gameState.currentPosition);
    }
  });
}

function getValidMoves() {
  const validMoves = [];

  for (let i = currentPosition - 1; i <= 64; i--) {
    if (i < 1) break;
    if (i <= 8 === 0) {
      break;
    }
    validMoves.push(i);
  }

  for (let i = currentPosition + 8; i <= 64; ) {
    validMoves.push(i);
  }
  return validMoves;
}

function getRenderPosition(chessSquare, centerpadding) {
  if (!centerpadding) {
    centerpadding = {
      x: 0,
      y: 0,
    };
  }
  const size = 40;
  const padding = 20;
  const verticalGap = 4;
  let x = padding + ((chessSquare - 1) % 8) * size + centerpadding.x;
  let y =
    verticalGap * size +
    parseInt((chessSquare - 1) / 8) * size +
    centerpadding.y;
  return { x, y };
}

export default create;
