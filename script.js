const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const xScoreDisplay = document.getElementById("x-score");
const oScoreDisplay = document.getElementById("o-score");

let xScore = 0;
let oScore = 0;

let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

statusText.textContent = "Player X's turn";

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

restartBtn.addEventListener("click", restartGame);

function handleCellClick(cell, index) {
    if (!gameActive || cell.textContent !== "") return;

    cell.textContent = currentPlayer;

    if (checkWinner()) {
        statusText.textContent = currentPlayer + " wins!";
        gameActive = false;

        if (currentPlayer === "X") {
            xScore++;
            xScoreDisplay.textContent = xScore;
        } else {
            oScore++;
            oScoreDisplay.textContent = oScore;
        }

        return;
    }

    if (isDraw()) {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = "Player " + currentPlayer + "'s turn";
}

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        if (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        ) {
            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");
            return true;
        }
    }
    return false;
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== "");
}

function restartGame() {
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
    currentPlayer = "X";
    gameActive = true;
    statusText.textContent = "Player X's turn";
}