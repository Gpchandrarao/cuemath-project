const express = require("express");
const path = require("path");
const { Server: Socket } = require("socket.io");
const { v4: uuid } = require("uuid");

const app = express();

const server = require("http").createServer(app);
const PORT = process.env.PORT || 6000;

const io = new Socket(server, {
  cors: ["http://localhost:5173"],
});

const GAMES = {};

app.use(express.static(path.resolve("../dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("../dist", "index.html"));
});

io.on("connection", (server) => {
  server.on("create-game", () => {
    const roomNumber = uuid().split("-")[0];
    server.join(roomNumber);
    server.emit("game-create", roomNumber);
    server.gameNumber = roomNumber;
  });

  server.on("disconnect", () => {
    if (server.gameNumber) {
      let winner = GAMES[server.gameNumber];
      if (GAMES[server.gameNumber] === server.id) {
        winner = GAMES[server.gameNumber].nextPlayer;
      }
      io.to(server.gameNumber).emit("win", winner);
    }
  });

  server.on("join", (gameNumber) => {
    const roomExists = io.socket.adapter.room.has(gameNumber);
    if (roomExists) {
      server.join(gameNumber);
      server.gameNumber = gameNumber;
      const players = Array.from(io.socket.adapter.rooms.get(gameNumber));
      createGame(players, gameNumber);
      players.forEach((player) => {
        const gameData = {
          playersMove: GAMES[gameNumber] === player,
          gameNumber,
        };
        io.to(player).emit("ready", gameData);
      });
      return;
    }
    server.emit("wrong-code");
  });

  server.on("player-moved", (gameNumber, moveTo) => {
    const allValidMoves = getValidMove(GAMES[gameNumber].currentRookPosition);
    if (!allValidMoves.includes(parseInt(moveTo))) return;

    if (parseInt(moveTo === 57)) {
      io.to(gameNumber).emit("win", GAMES[gameNumber]);
    }

    io.to(GAMES[gameNumber].nextPlayer).emit("opponent-moved", moveTo);

    const temp = GAMES[gameNumber].nextPlayer;
    GAMES[gameNumber].nextPlayer = GAMES[gameNumber];
    GAMES[gameNumber] = temp;
    GAMES[gameNumber].currentRookPosition = moveTo;

    const players = Array.from(io.socket.adapter.room.get(gameNumber));
    players.forEach((player) => {
      const gameNumber = { playersMove: GAMES[gameNumber] === player };
      io.to(player).emit("ready-next-move", gameData);
    });
  });

  server.on("lost-time", (gameNumber) => {
    if (!gameNumber) return;
    const winner = GAMES[gameNumber].nextPlayer;
    io.to(gameNumber).emit("time-win", winner);
  });
});

function createGame(players, gameNumber) {
  GAMES[gameNumber] = {
    currentPlayer: players[0],
    nextPlayer: players[1],
    currentRookPosition: 8,
  };
}

function getValidMove(currentPosition) {
  const validMoves = [];

  for (let i = currentPosition - 1; i <= 64; i--) {
    if (i < 1) break;
    if (i % 8 === 0) {
      break;
    }
    validMoves.push(i);
  }

  for (let i = currentPosition + 8; i <= 64; i += 8) {
    validMoves.push(i);
  }
  return validMoves;
}

server.listen(PORT, () => {
  console.log(`server running ${PORT}`);
});
