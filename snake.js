const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("gameOver");
const restartButton = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let dx;
let dy;
let score;
let gameLoop;

function initGame() {
    snake = [
        { x: 10, y: 10 }
    ];

    dx = 1;
    dy = 0;

    score = 0;
    scoreElement.textContent = `Score: ${score}`;

    food = generateFood();

    gameOverElement.style.display = "none";

    clearInterval(gameLoop);
    gameLoop = setInterval(drawGame, 120);
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawGame() {
    // Calculate new head position
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // Wrap around walls
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;

    // Self collision
    for (const segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            endGame();
            return;
        }
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = `Score: ${score}`;

        do {
            food = generateFood();
        } while (
            snake.some(
                segment =>
                    segment.x === food.x &&
                    segment.y === food.y
            )
        );
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    // Background
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );

    // Snake
    ctx.fillStyle = "#4CAF50";

    for (const segment of snake) {
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    }
}

function endGame() {
    clearInterval(gameLoop);
    gameOverElement.style.display = "block";
}

restartButton.addEventListener("click", initGame);

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (dy !== 1) {
                dx = 0;
                dy = -1;
            }
            break;

        case "ArrowDown":
            if (dy !== -1) {
                dx = 0;
                dy = 1;
            }
            break;

        case "ArrowLeft":
            if (dx !== 1) {
                dx = -1;
                dy = 0;
            }
            break;

        case "ArrowRight":
            if (dx !== -1) {
                dx = 1;
                dy = 0;
            }
            break;
    }
});

initGame();
