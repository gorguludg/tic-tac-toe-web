const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const xScoreDisplay = document.getElementById("x-score");
const oScoreDisplay = document.getElementById("o-score");

let xScore = 0;
let oScore = 0;
let vsComputer = false;
let currentPlayer = "X";
let gameActive = true;

const pvpBtn = document.getElementById("pvp-btn");
const pvcBtn = document.getElementById("pvc-btn");

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

pvpBtn.addEventListener("click", () => {
    vsComputer = false;
    resetScores();
    restartGame();
});

pvcBtn.addEventListener("click", () => {
    vsComputer = true;
    resetScores();
    restartGame();
});

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

    if (vsComputer && currentPlayer === "O" && gameActive) {
        setTimeout(computerMove, 500);
    }
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

function computerMove() {
    // 1. Try to win
    let move = findBestMove("O");
    if (move !== null) {
        cells[move].click();
        return;
    }

    // 2. Block player from winning
    move = findBestMove("X");
    if (move !== null) {
        cells[move].click();
        return;
    }

    // 3. Otherwise random move
    let emptyCells = [];
    cells.forEach((cell, index) => {
        if (cell.textContent === "") {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cells[randomIndex].click();
}

function findBestMove(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        const values = [
            cells[a].textContent,
            cells[b].textContent,
            cells[c].textContent
        ];

        if (
            values.filter(v => v === player).length === 2 &&
            values.includes("")
        ) {
            if (cells[a].textContent === "") return a;
            if (cells[b].textContent === "") return b;
            if (cells[c].textContent === "") return c;
        }
    }
    return null;
}

function resetScores() {
    xScore = 0;
    oScore = 0;
    xScoreDisplay.textContent = xScore;
    oScoreDisplay.textContent = oScore;
}