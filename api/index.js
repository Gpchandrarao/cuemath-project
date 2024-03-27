// const express = require("express");
// const path = require("path");
// const { Server: Socket } = require("socket.io");
// const { v4: uuid } = require("uuid");

// const app = express();

// const server = require("http").createServer(app);
// const PORT = process.env.PORT || 4412;

// const io = new Socket(server, {
//   cors: ["http://localhost:5173"],
// });

// const GAMES = {};

// app.use(express.static(path.resolve("../dist")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.resolve("../dist", "index.html"));
// });

// io.on("connection", (server) => {
//   server.on("create-game", () => {
//     const roomName = uuid().split("-")[0];
//     server.join(roomName);
//     server.emit("game-create", roomName);
//     server.gameNumber = roomName;
//   });

//   server.on("disconnect", () => {
//     if (server.gameNumber) {
//       let winnerId = GAMES[server.gameNumber];
//       if (GAMES[server.gameNumber] === server.id) {
//         winnerId = GAMES[server.gameNumber].nextPlayer;
//       }
//       io.to(server.gameNumber).emit("win", winnerId);
//     }
//   });

//   server.on("join-game", (gameNumber) => {
//     const roomExists = io.sockets.adapter.rooms.has(gameNumber);
//     if (roomExists) {
//       server.join(gameNumber);
//       server.gameNumber = gameNumber;
//       const players = Array.from(io.sockets.adapter.rooms.get(gameNumber));
//       createGame(players, gameNumber);
//       players.forEach((player) => {
//         const gameData = {
//           playersMove: GAMES[gameNumber] === player,
//           gameNumber,
//         };
//         io.to(player).emit("ready", gameData);
//       });
//       return;
//     }
//     server.emit("wrong-code");
//   });

//   server.on("player-moved", (gameNumber, moveTo) => {
//     const allValidMoves = getValidMoves(GAMES[gameNumber].currentRookPosition);
//     if (!allValidMoves.includes(parseInt(moveTo))) return;

//     if (parseInt(moveTo === 57)) {
//       io.to(gameNumber).emit("win", GAMES[gameNumber].currentPlayer);
//     }

//     io.to(GAMES[gameNumber].nextPlayer).emit("opponent-moved", moveTo);

//     const temp = GAMES[gameNumber].nextPlayer;
//     GAMES[gameNumber].nextPlayer = GAMES[gameNumber].currentPlayer;
//     GAMES[gameNumber] = temp;
//     GAMES[gameNumber].currentRookPosition = moveTo;

//     const players = Array.from(io.socket.adapter.room.get(gameNumber));
//     players.forEach((player) => {
//       const gameData = {
//         playerMove: GAMES[gameNumber].currentPlayer === player,
//       };
//       io.to(player).emit("ready-next-move", gameData);
//     });
//   });

//   server.on("lost-time", (gameNumber) => {
//     if (!gameNumber) return;
//     const winner = GAMES[gameNumber].nextPlayer;
//     io.to(gameNumber).emit("time-win", winner);
//   });
// });

// function createGame(players, gameNumber) {
//   GAMES[gameNumber] = {
//     currentPlayer: players[0],
//     nextPlayer: players[1],
//     currentRookPosition: 8,
//   };
// }

// function getValidMoves(currentPosition) {
//   const validMoves = [];

//   for (let i = currentPosition - 1; i <= 64; i--) {
//     if (i < 1) break;
//     if (i % 8 === 0) {
//       break;
//     }
//     validMoves.push(i);
//   }

//   for (let i = currentPosition + 8; i <= 64; i += 8) {
//     validMoves.push(i);
//   }
//   return validMoves;
// }

// server.listen(PORT, () => {
//   console.log(`server running ${PORT}`);
// });
const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const { Server: Socket } = require("socket.io");
const { v4: uuid } = require("uuid");

const io = new Socket(server, {
  cors: ["http://localhost:5173"], // WS cors configuration
});

const GAMES = {};

// Host client
app.use(express.static(path.resolve("../dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve("../dist", "index.html"));
});

io.on("connection", (client) => {
  client.on("create-game", () => {
    const roomName = uuid().split("-")[0];
    client.join(roomName);
    client.emit("game-created", roomName);
    client.gameCode = roomName;
  });

  client.on("disconnect", () => {
    if (client.gameCode) {
      let winnerId = GAMES[client.gameCode];
      if (GAMES[client.gameCode] === client.id) {
        winnerId = GAMES[client.gameCode].nextPlayer;
      }
      io.to(client.gameCode).emit("win", winnerId);
    }
  });

  client.on("join-game", (gameCode) => {
    const roomExists = io.sockets.adapter.rooms.has(gameCode);
    if (roomExists) {
      client.join(gameCode);
      client.gameCode = gameCode;
      const players = Array.from(io.sockets.adapter.rooms.get(gameCode));
      createGame(players, gameCode);
      players.forEach((player) => {
        const gameData = { playerMove: GAMES[gameCode] === player, gameCode };
        io.to(player).emit("ready", gameData);
      });
      return;
    }
    client.emit("wrong-code");
  });

  client.on("player-moved", (gameCode, moveTo) => {
    // Check if move sent by client is a valid move
    const allValidMoves = getValidMoves(GAMES[gameCode].currentRookPosition);
    if (!allValidMoves.includes(parseInt(moveTo))) return;

    // Check if won
    if (parseInt(moveTo) === 57) {
      io.to(gameCode).emit("win", GAMES[gameCode]);
    }

    // Let opponent know where player moved
    io.to(GAMES[gameCode].nextPlayer).emit("opponent-moved", moveTo);

    // Swap players
    const temp = GAMES[gameCode].nextPlayer;
    GAMES[gameCode].nextPlayer = GAMES[gameCode];
    GAMES[gameCode] = temp;
    GAMES[gameCode].currentRookPosition = moveTo;

    // Flip player chance
    const players = Array.from(io.sockets.adapter.rooms.get(gameCode));
    players.forEach((player) => {
      const gameData = { playerMove: GAMES[gameCode] === player };
      io.to(player).emit("ready-next-move", gameData);
    });
  });

  client.on("lost-time", (gameCode) => {
    if (!gameCode) return;
    const winner = GAMES[gameCode].nextPlayer;
    io.to(gameCode).emit("time-win", winner);
  });
});

function createGame(players, gameCode) {
  GAMES[gameCode] = {
    currentPlayer: players[0],
    nextPlayer: players[1],
    currentRookPosition: 8,
  };
}

function getValidMoves(currentPosition) {
  const validMoves = [];

  // Valid left postions
  for (let i = currentPosition - 1; i <= 64; i--) {
    if (i < 1) break;
    if (i % 8 === 0) {
      break;
    }
    validMoves.push(i);
  }

  // Valid down postions
  for (let i = currentPosition + 8; i <= 64; i += 8) {
    validMoves.push(i);
  }
  return validMoves;
}

server.listen(4412, () => {
  console.log("server active on port 3000");
});
