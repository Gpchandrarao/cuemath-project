export default function setWinnerUI(isWinner) {
  const winUI = document.createElement("div");
  winUI.classList.add("modal");
  winUI.innerHTML = `
      <h1>You Won !</h1>
  `;
  const lostUI = document.createElement("div");
  lostUI.classList.add("modal");
  lostUI.innerHTML = `
      <h1 style="color:red">You Lost !</h1>
  `;
  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  backdrop.appendChild(isWinner ? winUI : lostUI);
  document.body.appendChild(backdrop);
}
