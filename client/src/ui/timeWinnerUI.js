export default function timeWinnerUI(isWinner) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.innerHTML = isWinner
    ? `<h1>You Won On Time !</h1>`
    : `<h1>You Lost On Time !</h1>`;
  return modal;
}
