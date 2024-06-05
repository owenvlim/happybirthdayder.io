const container = document.getElementById("container");
const btnYes = document.querySelector(".btn-yes");
const btnNo = document.querySelector(".btn-no");
const btnSpecial = document.querySelector(".btn-special");
const imageOne = document.querySelector(".images-1");
const imageTwo = document.querySelector(".images-2");
const imageThree = document.querySelector(".images-3");
const imageFour = document.querySelector(".images-4");
const imageFive = document.querySelector(".images-5");
const winCountElement = document.getElementById('winCount');
const lossCountElement = document.getElementById('lossCount');
const specialButton = document.getElementById("specialButton");
const explosionSound = document.getElementById("explosionSound");
const explosionImage = document.querySelector(".cover");
const heartImage = document.querySelector(".part4 img");

let winCount = 0;
let lossCount = 0;
const part1 = document.querySelector('.part1');
const part2 = document.querySelector('.part2');
const part3 = document.querySelector('.part3');
const part4 = document.querySelector('.part4');

let yesClicked = false;
let noClicks = 0;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

btnNo.addEventListener("click", () => {
    noClicks += 1;
    console.log(`No button clicked ${noClicks} times`);

    if (noClicks >= 8) {
        btnSpecial.classList.remove("hide");
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const btnRect = btnNo.getBoundingClientRect();

    let newTop, newLeft;

    do {
        newTop = getRandomNumber(0, windowHeight - btnRect.height);
    } while (Math.abs(newTop - btnRect.top) < windowHeight / 3);

    do {
        newLeft = getRandomNumber(0, windowWidth - btnRect.width);
    } while (Math.abs(newLeft - btnRect.left) < windowWidth / 3);

    btnNo.style.top = newTop + "px";
    btnNo.style.left = newLeft + "px";
});

btnYes.addEventListener("mouseenter", () => {
    if (!yesClicked) {
        imageOne.classList.add("hide");
        imageTwo.classList.remove("hide");
    }
});

btnYes.addEventListener("click", () => {
    yesClicked = true;
    setTimeout(() => {
        imageThree.classList.add("hide");
        imageFour.classList.remove("hide");
        document.body.classList.add("dark-background");
    }, 2000);
    setTimeout(() => {
        imageFour.classList.add("hide");
        setTimeout(() => {
            window.close();
        }, 0);
    }, 3000);
});

btnYes.addEventListener("mouseleave", () => {
    if (!yesClicked) {
        imageOne.classList.remove("hide");
        imageTwo.classList.add("hide");
    }
});

btnYes.addEventListener("click", () => {
    yesClicked = true;
    imageOne.classList.add("hide");
    imageTwo.classList.add("hide");
    imageThree.classList.remove("hide");
});

btnSpecial.addEventListener("click", () => {
    part1.classList.add("hide");
    part2.classList.remove("hide");
});

document.addEventListener("DOMContentLoaded", function() {
    const part1 = document.querySelector('.part1');
    const part2 = document.querySelector('.part2');
    const btnSpecial = document.querySelector(".btn-special");
    
    function showPart2() {
        part1.classList.add('hide');
        part2.classList.remove('hide');
    }

    btnSpecial.addEventListener("click", () => {
        showPart2();
        setTimeout(() => {
            alert("win to proof it");
        }, 1000);
    });
});

const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let difficulty = 0;
let botWinCount = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const checkWin = (player) => {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] === player && boardState[b] === player && boardState[c] === player) {
            return true;
        }
    }
    return false;
};

const checkDraw = () => {
    return boardState.every(cell => cell !== '');
};

const minimax = (board, depth, isMaximizing) => {
    if (checkWin('O')) return 10 - depth;
    if (checkWin('X')) return depth - 10;
    if (checkDraw()) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const botMove = () => {
    if (winCount === 2) {
        const cheatMoves = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        let cheatMove = cheatMoves.find(moves => moves.every(index => boardState[index] === ''));
        if (cheatMove) {
            cheatMove.forEach(index => {
                boardState[index] = 'O';
                cells[index].textContent = 'O';
            });
            setTimeout(() => {
                alert('Bot wins by cheating!');
                lossCount++;
                lossCountElement.textContent = `Losses: ${lossCount}`;
                botWinCount++;
                checkBotWinCount();
            }, 500);
            gameActive = false;
            return;
        }
    }

    let bestMove = null;
    let bestScore = -Infinity;
    let winningMoveFound = false;

    const randomChance = difficulty === 0 ? 0.6 : (difficulty === 1 ? 0.05 : 0);

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
            boardState[i] = 'O';
            if (checkWin('O')) {
                bestMove = i;
                winningMoveFound = true;
                break;
            }
            boardState[i] = '';
        }
    }

    if (!winningMoveFound) {
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'X';
                if (checkWin('X')) {
                    bestMove = i;
                    boardState[i] = '';
                    break;
                }
                boardState[i] = '';
            }
        }
    }

    if (bestMove === null) {
        const randomness = Math.random() < randomChance;
        if (randomness) {
            let availableCells = [];
            boardState.forEach((cell, index) => {
                if (cell === '') availableCells.push(index);
            });
            bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        } else {
            for (let i = 0; i < 9; i++) {
                if (boardState[i] === '') {
                    boardState[i] = 'O';
                    let score = minimax(boardState, 0, false);
                    boardState[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
        }
    }

    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin('O')) {
        setTimeout(() => {
            alert('Bot wins!');
            lossCount++;
            lossCountElement.textContent = `Losses: ${lossCount}`;
            botWinCount++;
            checkBotWinCount();
        }, 500);
        gameActive = false;
    } else if (checkDraw()) {
        setTimeout(() => {
            alert('Draw!');
            restartGame();
        }, 500);
        gameActive = false;
    }
};

const handleCellClick = (e) => {
    const clickedCellIndex = e.target.getAttribute('data-index');

    if (boardState[clickedCellIndex] !== '' || !gameActive) return;

    boardState[clickedCellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        setTimeout(() => {
            alert(`${currentPlayer} wins!`);
            winCount++;
            winCountElement.textContent = `Wins: ${winCount}`;
            checkGameOver();
            restartGame();
        }, 500);
        gameActive = false;
    } else if (checkDraw()) {
        setTimeout(() => {
            alert('Draw!');
            restartGame();
        }, 500);
        gameActive = false;
    } else {
        currentPlayer = 'O';
        botMove();
        currentPlayer = 'X';
    }
};

const checkGameOver = () => {
    if (winCount >= 3) {
        difficulty++;
        winCount = 0;
        if (difficulty >= 3) {
            part2.classList.add('hide');
            imageFive.classList.remove('hide');
        }
    }
};

const checkBotWinCount = () => {
    if (botWinCount >= 3) {
        showPart3();
    } else {
        restartGame();
    }
};

const restartGame = () => {
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => cell.textContent = '');
};

const showPart3 = () => {
    part1.classList.add('hide');
    part2.classList.add('hide');
    part3.classList.remove('hide');
};

const hidePart3ShowPart4 = () => {
    part3.classList.add('hide');
    part4.classList.remove('hide');
};

document.querySelector('.hellohi').addEventListener('click', hidePart3ShowPart4);

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);

specialButton.addEventListener("click", () => {
    // Show the heart image
    heartImage.classList.remove("hide");
    
    // Set the countdown before the explosion
    setTimeout(() => {
      // Show the explosion GIF
        explosionImage.style.opacity = 1;
        explosionImage.style.pointerEvents = "auto";
    
        // Play the explosion sound
        explosionSound.play();
    
        // Close the window after a delay
        setTimeout(() => {
            window.close();
        }, 3000); // Adjust the delay as needed
        }, 10000); // Adjust the countdown duration as needed
    });

    specialButton.addEventListener("click", () => {
        // Show the heart image
        heartImage.classList.remove("hide");
        
        // Set the countdown before the explosion
        setTimeout(() => {
        // Show the explosion GIF
        explosionImage.style.opacity = 1;
        explosionImage.style.pointerEvents = "auto";
    
        // Play the explosion sound
        explosionSound.play();
    
        // Close the window after a delay
        setTimeout(() => {
            window.close();
        }, 3000); // Adjust the delay as needed
        }, 10000); // Adjust the countdown duration as needed
    });