const cells = document.querySelectorAll(".cell");
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

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
});

function handleCellClick(cell, index) {
    if (!gameActive || cell.textContent !== "") return;

    cell.textContent = currentPlayer;

    if (checkWinner()) {
        alert(currentPlayer + " wins!");
        gameActive = false;
        return;
    }

    if (isDraw()) {
        alert("It's a draw!");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function checkWinner() {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return (
            cells[a].textContent &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        );
    });
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== "");
}