const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird = {
    x: 50,
    y: canvas.height / 2,
    vx: 0,
    vy: 0,
    radius: 20,
    gravity: 0.3
};

let pipes = [];
let score = 0;
let gameOver = false;

// Draw bird
function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
}

// Draw pipes
function drawPipes() {
    for (let i = 0; i < pipes.length; i++) {
        ctx.beginPath();
        ctx.rect(pipes[i].x, 0, pipes[i].width, pipes[i].topHeight);
        ctx.fillStyle = 'green';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(pipes[i].x, pipes[i].topHeight + pipes[i].gap, pipes[i].width, canvas.height);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}

// Update game state
function update() {
    // Update bird position
    bird.vy += bird.gravity;
    bird.y += bird.vy;

    // Check collision with ground or top
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver = true;
    }

    // Update pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        // Check collision with bird
        if (pipes[i].x < bird.x + bird.radius &&
            pipes[i].x + pipes[i].width > bird.x - bird.radius &&
            (bird.y - bird.radius < pipes[i].topHeight ||
             bird.y + bird.radius > pipes[i].topHeight + pipes[i].gap)) {
            gameOver = true;
        }

        // Remove pipe if it's off-screen
        if (pipes[i].x < -pipes[i].width) {
            pipes.splice(i, 1);
            score++;
        }
    }

    // Add new pipe
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        pipes.push({
            x: canvas.width,
            width: 80,
            topHeight: Math.random() * (canvas.height - 200),
            gap: 150
        });
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);

    if (gameOver) {
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        bird.vy = -6;
    }
});

// Main game loop
function loop() {
    if (!gameOver) {
        update();
    }
    draw();
    requestAnimationFrame(loop);
}

loop();
