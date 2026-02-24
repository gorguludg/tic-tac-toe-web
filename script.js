const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const xScoreDisplay = document.getElementById("x-score");
const oScoreDisplay = document.getElementById("o-score");

const pvpBtn = document.getElementById("pvp-btn");
const pvcBtn = document.getElementById("pvc-btn");

const symbolToggle = document.getElementById("symbol-toggle");
const chooseXBtn = document.getElementById("choose-x");
const chooseOBtn = document.getElementById("choose-o");

let playerSymbol = "X";
let computerSymbol = "O";
let vsComputer = false;

let xScore = 0;
let oScore = 0;

let currentPlayer = "X";
let gameActive = true;

const winningCombinations = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

statusText.textContent = "Player X's turn";

/* =====================
   Toggle Helper
===================== */

function setActiveToggle(clickedBtn, groupElement) {
    const buttons = groupElement.querySelectorAll(".toggle-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    clickedBtn.classList.add("active");
}

/* =====================
   Mode Switching
===================== */

pvpBtn.addEventListener("click", () => {
    setActiveToggle(pvpBtn, document.getElementById("mode-toggle"));

    vsComputer = false;
    symbolToggle.style.display = "none";

    resetScores();
    restartGame();
});

pvcBtn.addEventListener("click", () => {
    setActiveToggle(pvcBtn, document.getElementById("mode-toggle"));

    vsComputer = true;
    symbolToggle.style.display = "inline-flex";

    resetScores();
    restartGame();
});

/* =====================
   Symbol Selection
===================== */

chooseXBtn.addEventListener("click", () => {
    setActiveToggle(chooseXBtn, symbolToggle);

    playerSymbol = "X";
    computerSymbol = "O";

    resetScores();
    restartGame();
});

chooseOBtn.addEventListener("click", () => {
    setActiveToggle(chooseOBtn, symbolToggle);

    playerSymbol = "O";
    computerSymbol = "X";

    resetScores();
    restartGame();
});

/* =====================
   Game Logic
===================== */

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

restartBtn.addEventListener("click", restartGame);

function handleCellClick(cell, index) {
    if (!gameActive || cell.textContent !== "") return;

    cell.textContent = currentPlayer;
    cell.classList.remove("filled"); // reset if needed
    void cell.offsetWidth;           // force reflow
    cell.classList.add("filled");

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

    if (vsComputer && currentPlayer === computerSymbol && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function checkWinner() {
    for (let combo of winningCombinations) {
        const [a,b,c] = combo;

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
        cell.classList.remove("filled");
    });

    currentPlayer = playerSymbol;
    gameActive = true;
    statusText.textContent = "Player " + currentPlayer + "'s turn";

    // If computer should start
    if (vsComputer && playerSymbol === "O") {
        currentPlayer = computerSymbol;
        statusText.textContent = "Player " + currentPlayer + "'s turn";
        setTimeout(computerMove, 500);
    }
}

/* =====================
   Smarter AI
===================== */

function computerMove() {
    let move = findBestMove(computerSymbol);
    if (move !== null) {
        cells[move].click();
        return;
    }

    move = findBestMove(playerSymbol);
    if (move !== null) {
        cells[move].click();
        return;
    }

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
    for (let combo of winningCombinations) {
        const [a,b,c] = combo;
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