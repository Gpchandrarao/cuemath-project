import socket from "../socket";

import timeWinnerUI from "./timeWinnerUI";
import createdGameUI from "./createdGameUI.js";

function initUI() {
  const backdrop = document.createElement("div");

  backdrop.classList.add("backdrop");
  backdrop.innerHTML = `
    <div clas="modal"> 
        <h1 > create Game </h1>
        <button class="create-game-btn">Create game</button>
        <div class="join-game-form>
        <h1>Join Game</h1>
        <imput type="text" class="join-game-input" placeholder="Game code">
        <p class="error"></p>
        <button class="join-game-btn">join game</button>
    </div>
    `;

  document.body.appendChild(backdrop);
  const creategameButton = document.querySelector(".create-game-btn");
  creategameButton.addEventListener("click", () => {
    createGame();
    creategameButton.disabled = true;
    creategameButton.innerText = "Creating Game..";
  });
  const joinGamebutton = document.querySelector(".join-game-btn");
  joinGamebutton.addEventListener("click", () => {
    socket.on("worng-code", () => {
      const error = document.querySelector(".error");
      error.innerText = "worng room code";
      socket.off("worng-code");
    });
    joinGame();
  });
  socket.on("ready", () => {
    backdrop.remove();
  });

  socket.on("time-win", (winnerId) => {
    let isWinner = false;
    if (winnerId === socket.id) {
      isWinner = true;
    }
    if (this?.timer) {
      clearTimeout(this.timer);
    }
    backdrop.innerText = timeWinnerUI(isWinner);
    document.body.appendChild(backdrop);
  });
}

function createGame() {
  socket.emit("create-game");
  socket.on("game-created", (gameCode) => {
    const modal = document.querySelector(".modal");
    modal.innerHTML = createdGameUI(gameCode);
    socket.off("game-created");
  });
}

function joinGame() {
  const input = document.querySelector(".join-game-input");
  const roomcode = input.value;
  if (!roomcode) {
    return;
  }
  socket.emit("join-game", roomcode);
}

export default initUI;
