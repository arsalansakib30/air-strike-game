const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 600;
canvas.height = 400;

// Plane object
const plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    bullets: []
};

// Bomb object
const bombs = [];
const bombSpeed = 2;
const spawnBombInterval = 1000; // 1 bomb every second

// Controls
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === ' ') spacePressed = true;
}

function keyUpHandler(e) {
    if (e.key === 'ArrowLeft') leftPressed = false;
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === ' ') spacePressed = false;
}

// Plane movement
function movePlane() {
    if (leftPressed && plane.x > 0) plane.x -= plane.speed;
    if (rightPressed && plane.x < canvas.width - plane.width) plane.x += plane.speed;
}

// Draw the plane
function drawPlane() {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(plane.x, plane.y, plane.width, plane.height);
}

// Bullet mechanics
function shootBullet() {
    if (spacePressed) {
        plane.bullets.push({ x: plane.x + plane.width / 2 - 2.5, y: plane.y, width: 5, height: 10 });
        spacePressed = false; // To avoid rapid fire
    }
}

function moveBullets() {
    plane.bullets = plane.bullets.filter(bullet => bullet.y > 0);
    plane.bullets.forEach(bullet => bullet.y -= 5);
}

function drawBullets() {
    ctx.fillStyle = '#ff0';
    plane.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Bomb mechanics
function spawnBomb() {
    bombs.push({ x: Math.random() * (canvas.width - 30), y: 0, width: 30, height: 30 });
}

function moveBombs() {
    bombs.forEach(bomb => bomb.y += bombSpeed);
}

function drawBombs() {
    ctx.fillStyle = '#f00';
    bombs.forEach(bomb => {
        ctx.fillRect(bomb.x, bomb.y, bomb.width, bomb.height);
    });
}

// Collision detection
function detectCollisions() {
    bombs.forEach((bomb, bombIndex) => {
        plane.bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < bomb.x + bomb.width &&
                bullet.x + bullet.width > bomb.x &&
                bullet.y < bomb.y + bomb.height &&
                bullet.height + bullet.y > bomb.y
            ) {
                bombs.splice(bombIndex, 1); // Remove bomb
                plane.bullets.splice(bulletIndex, 1); // Remove bullet
            }
        });
    });
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlane();
    shootBullet();
    moveBullets();
    moveBombs();
    detectCollisions();

    drawPlane();
    drawBullets();
    drawBombs();

    requestAnimationFrame(gameLoop);
}

// Start the game
setInterval(spawnBomb, spawnBombInterval);
gameLoop();
