const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const itemColor = "#000000";

// brick property
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// init bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, state: 1 };
        }
}

// game object
let score = 0;
let lives = 3;
let isStarted = false;

// ball property
const ballRadius = 10;

// paddle property
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// movement property
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// control property
let rightPressed = false;
let leftPressed = false;

// draw
function drawStartText() {
        ctx.font = "16px Arial";
        ctx.fillStyle = itemColor;
        ctx.fillText("Touch to start!", x - 60, canvas.height / 2);
}
function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = itemColor;
        ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}
function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = itemColor;
        ctx.fill();
        ctx.closePath();
}
function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = itemColor;
        ctx.fill();
        ctx.closePath();
}
function drawBrick(brickX, brickY, brickWidth, brickHeight) {
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = itemColor;
        ctx.fill();
        ctx.closePath();

}
function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                        const block = bricks[c][r];
                        if (isThere(block)) {
                                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                                block.x = brickX;
                                block.y = brickY;
                                drawBrick(brickX, brickY, brickWidth, brickHeight);
                        }
                }
        }
}
function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = itemColor;
        ctx.fillText(`Score: ${score}`, 8, 20);
}
// control
function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
        }
}
function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
        }
}
function mouseMoveHandler(e) {
        const relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
        }
}
function touchedStartGame(e) {
        const mx = e.clientX
        const my = e.clientY;
        // whene touched start text
        if (!isStarted)
        {
                isStarted = true;
                startGame();
        }
}
function movePaddle() {
        if (rightPressed) {
                paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth); // paddle X position limits to canvas width (right move)
        } else if (leftPressed) {
                paddleX = Math.max(paddleX - 7, 0); // paddle X position limits to 0 (left move)
        }
}
function bounceBall() {
        if (touchedLeftRightWall()) {
                dx = -dx;
        }
        if (touchedUpWall()) {
                dy = -dy;
        } else if (tochedDownWall()) {
                // when touched paddle
                if (touchedPaddle()) {
                        dy = -dy;
                } else {
                        // when touched down wall
                        lives--;
                        if (!lives) {
                                alert("Game over");
                                reloadGame();
                        } else {
                                resetGame();
                        }
                }
        }
}
// helper
function isFinished() {
        return (score === brickColumnCount * brickRowCount) ? true : false;
}
function touchedBrick(brick) {
        return ((x > brick.x && x < brick.x + brickWidth) && (y > brick.y && y < brick.y + brickHeight)) ? true : false;
}
function touchedLeftRightWall() {
        return (x + dx > canvas.width - ballRadius || x + dx < ballRadius) ? true : false;
}
function touchedUpWall() {
        return (y + dy < ballRadius) ? true : false;
}
function tochedDownWall() {
        return (y + dy > canvas.height - ballRadius) ? true : false;
}
function touchedPaddle() {
        return (x > paddleX && x < paddleX + paddleWidth) ? true : false;
}
function isThere(block) {
        return block.state === 1 ? true : false;
}
function reloadGame() {
        document.location.reload();
}
function resetGame() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;  
}
// logic
// IMPORTANT
function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                        const block = bricks[c][r];
                        if (isThere(block)) {
                                if (touchedBrick(block)) {
                                        dy = -dy;
                                        block.state = 0;
                                        score++;

                                        if (isFinished()) {
                                                alert("You win");
                                                reloadGame();
                                        }
                                }
                        }
                }
        }
}
// loop
function draw() {

        // clear board
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!isStarted) { drawStartText(); }

        // draw
        drawScore();
        drawLives();
        drawBall();
        drawPaddle();
        drawBricks();

        // check game logic
        bounceBall();
        movePaddle();
        collisionDetection();

        // update ball position
        x += dx;
        y += dy;

        // for better fps
        requestAnimationFrame(draw);
}
// start here :)
function startGame() {
        draw();
}

drawStartText();
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", touchedStartGame, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

