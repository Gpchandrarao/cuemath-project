import socket from "../socket.js";
import timeWinnerUI from "./timeWinnerUI.js";
import createdGameUI from "./createdGameUI.js";

function initUI() {
  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  backdrop.innerHTML = `
        <div class="modal">
            <h1>Create Game</h1>
            <button class="create-game-btn">Create Game</button>
            <div class="join-game-form">
                <h1>Join Game</h1>
                <input type="text" class="join-game-input" placeholder="Game Code">
                <p class="error"></p>
                <button class="join-game-btn">Join Game</button>
            </div>
        </div>
    `;
  document.body.appendChild(backdrop);

  const createGameButton = document.querySelector(".create-game-btn");
  createGameButton.addEventListener("click", () => {
    createGame();
  });

  const joinGameButton = document.querySelector(".join-game-btn");
  joinGameButton.addEventListener("click", () => {
    joinGame();
  });

  socket.on("ready", () => {
    backdrop.remove();
  });

  socket.on("time-win", (winnerId) => {
    const isWinner = winnerId === socket.id;
    if (this?.timer) {
      clearTimeout(this.timer);
    }
    backdrop.innerHTML = timeWinnerUI(isWinner);
    document.body.appendChild(backdrop);
  });
}

function createGame() {
  socket.emit("create-game");
  socket.on("game-created", (gameCode) => {
    const modal = document.querySelector(".modal");
    modal.innerHTML = createdGameUI(gameCode);
  });
}

function joinGame() {
  const input = document.querySelector(".join-game-input");
  const roomCode = input.value;
  if (!roomCode) return;
  socket.emit("join-game", roomCode);
}

export default initUI;
