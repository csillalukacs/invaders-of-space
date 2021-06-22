const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 15;
const CELL_SIZE = 36;
const COOLDOWN = 0.2;
const SCORE_MULTIPLIER = 0.25;
const INITIAL_SPEED = 1000;
const MAX_SPEED = 400;

let player_pos = Math.floor(BOARD_WIDTH / 2);
const projectiles = [];
const enemies = [];
let lastShot = new Date();
let direction = 1;
let gameOver = false;
let enemyTimer = null;
let level = 0;
let score = 0;
let lives = 3;


function initGame() {
    createBoardDivs();
    const body = document.querySelector("body");
    body.addEventListener('keydown', movePlayer);
    body.addEventListener('keypress', shoot);
    livesDisplay = document.getElementById('lives');
    livesDisplay.innerHTML = `lives: ${lives}`;
    startLevel();
}

function startLevel() {
    clearInterval(enemyTimer);
    enemyCells = document.querySelectorAll(".enemy")
    enemyCells.forEach((cell)=>{
        cell.classList.remove("enemy");
        for (cl of cell.classList){
            if (cl.includes("type")){
                cell.classList.remove(cl);
            }
        }
    })
    enemies.splice(0, enemies.length);
    levelDisplay = document.getElementById('level');
    levelDisplay.innerHTML = `level: ${level}`;
    createEnemies();
    if (INITIAL_SPEED - level * 100 > 500) {
        
        initEnemies(INITIAL_SPEED - level * 100);
        console.log("wtf");
    } else if (INITIAL_SPEED - 600 - (level - 6) * 10 > MAX_SPEED) {
        initEnemies(INITIAL_SPEED - 600 - (level - 6) * 10);
        console.log(INITIAL_SPEED - 600 - (level - 6) * 10);
    } else {
        initEnemies(MAX_SPEED);
        console.log("???")
    }
    draw();
}

function createEnemies() {
    type = 0;
    for (let i = 5; i < BOARD_WIDTH - 5; i++) {
        for (let j = 3; j < BOARD_HEIGHT - 3; j++) {
            if ((j + 1) % 3 !== 0) { addEnemy(i, j, (4 - Math.floor(j / 3))) }
        }
    }
    // for (let i = 3; i < BOARD_WIDTH - 3; i++) {
    //     addEnemy(i, 5);
    // }
}


function addEnemy(x, y, type) {
    let newEnemy = { x: x, y: y, type: type };
    enemies.push(newEnemy);
}


function initEnemies(enemyDelay) {
    enemyTimer = setInterval(updateEnemies, enemyDelay);
}


function getFirstEnemyX() {
    let minX = BOARD_WIDTH;
    for (let enemy of enemies) {
        if (enemy.x < minX) {
            minX = enemy.x;
        }
    }
    return minX;
}


function getLastEnemyX() {
    let maxX = 0;
    for (let enemy of enemies) {
        if (enemy.x > maxX) {
            maxX = enemy.x;
        }
    }
    return maxX;
}

function getLowestEnemyY() {
    let maxY = 0;
    for (let enemy of enemies) {
        if (enemy.y > maxY) {
            maxY = enemy.y;
        }
    }
    return maxY;
}


function updateEnemies() {
    if (!gameOver) {
        const distanceFromRight = (BOARD_WIDTH - 1) - getLastEnemyX();
        const distanceFromLeft = getFirstEnemyX();
        const distanceFromBottom = (BOARD_HEIGHT - 1) - getLowestEnemyY();

        if (direction === 1) {
            for (let enemy of enemies) {
                enemy.x++;
            }
            if (distanceFromRight === 1) {
                direction = 0;
            }
        } else if (direction === -1) {
            for (let enemy of enemies) {
                enemy.x--;
            }
            if (distanceFromLeft === 1) {
                direction = 0;
            }
        } else if (direction === 0) {
            for (let enemy of enemies) {
                enemy.y++;
            }
            direction = (distanceFromRight === 0) ? -1 : 1;
            if (distanceFromBottom - 1 === 0) {
                lives--;
                livesDisplay = document.getElementById('lives');
                livesDisplay.innerHTML = `lives: ${lives}`;

                if (lives === 0){ 
                    lose();
                } else {
                    startLevel();
                }
            }
        }
        if (!gameOver) { drawEnemies(); }
    }
}


function shoot(e) {
    if (e.keyCode === 32 && !gameOver) {
        var currentTime = new Date();
        if (lastShot.getTime() / 1000 + COOLDOWN < currentTime.getTime() / 1000) {
            let newProjectile = { x: player_pos, y: BOARD_HEIGHT - 2 }
            projectiles.push(newProjectile);
            let timer = setInterval(() => updateProjectile(newProjectile, timer), 50);
            draw();
            lastShot = new Date();
        }
    }
}


function updateProjectile(projectile, timer) {
    if (enemyAt(projectile.x, projectile.y)) {
        clearInterval(timer);
        index = projectiles.indexOf(projectile);
        projectiles.splice(index, 1);
    } else if (projectile.y > 0) {
        projectile.y--;
    }
    else {
        clearInterval(timer);
        index = projectiles.indexOf(projectile);
        projectiles.splice(index, 1);
    }
    draw();
}


function enemyAt(x, y) {
    cell = document.querySelector(`.square[data-row="${y}"][data-col="${x}"]`);
    if (cell.classList.contains("enemy")) {
        cell.classList.remove("enemy");
        for (cl of cell.classList) {
            if (cl.includes("type")) {
                cell.classList.remove(cl);
            }
        }
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].x === x && enemies[i].y === y) {
                let enemy = enemies[i]
                score += enemy.type * (1 + SCORE_MULTIPLIER * level);
                enemies.splice(i, 1);
            }
        }


        scoreDisplay = document.getElementById('score');
        scoreDisplay.innerHTML = `score: ${score}`;

        

        if (enemies.length === 0) {
            win();
        }
        return true;
    }
}

// bal = 37, jobb = 39
function movePlayer(e) {
    if (e.keyCode === 37 && !gameOver) {
        moveLeft();
        draw();

    } else if (e.keyCode === 39 && !gameOver) {
        moveRight();
        draw();
    }
}

function moveLeft() {
    if (player_pos > 0) {
        player_pos--;
    }
}

function moveRight() {
    if (player_pos < BOARD_WIDTH - 1) {
        player_pos++;
    }
}

function createBoardDivs() {

    const grid = document.querySelector('.grid');
    grid.style.width = `${CELL_SIZE * BOARD_WIDTH}px`;
    grid.style.height = `${CELL_SIZE * BOARD_HEIGHT}px`;
    const game = document.querySelector('#game');
    game.style.width = `${CELL_SIZE * BOARD_WIDTH}px`;
    game.style.height = `${CELL_SIZE * BOARD_HEIGHT}px`;
    let row = -1;
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
        if (i % BOARD_WIDTH === 0) {
            row++;
        }
        grid.insertAdjacentHTML(
            'beforeend',
            `<div class="square" data-row="${row}" data-col="${(i % BOARD_WIDTH)}"></div>`
        );
    }

    const cells = document.querySelectorAll(".grid div");

    cells.forEach((cell) => {
        cell.style.width = `${CELL_SIZE}px`;
        cell.style.height = `${CELL_SIZE}px`;
    });
}

function draw() {

    let lastRow = document.querySelectorAll(`.square[data-row="${BOARD_HEIGHT - 1}"]`);
    lastRow.forEach((cell) => { cell.classList.remove("player") });
    let playerCell = document.querySelector(`.square[data-row="${BOARD_HEIGHT - 1}"][data-col="${player_pos}"]`);
    playerCell.classList.add("player");

    let cells = document.querySelectorAll(".square");
    cells.forEach((cell) => { cell.classList.remove("bullet") });

    for (projectile of projectiles) {
        projectileCell = document.querySelector(`.square[data-row="${projectile.y}"][data-col="${projectile.x}"]`)
        projectileCell.classList.add("bullet");
    }
}

function drawEnemies() {
    let enemyCells = document.querySelectorAll(".enemy");
    enemyCells.forEach((cell) => {
        cell.classList.remove("enemy");
        for (cl of cell.classList) {
            if (cl.includes("type")) {
                cell.classList.remove(cl);
            }
        }
    });

    for (enemy of enemies) {

        enemyCell = document.querySelector(`.square[data-row="${enemy.y}"][data-col="${enemy.x}"]`)
        enemyCell.classList.add("enemy");
        enemyCell.classList.add(`type${enemy.type}`);
    }
}

function lose() {
    gameOver = true;
    alert('You lost!');

}


function win() {
    setTimeout(() => { alert('Next wave is coming! Get ready! '); }, 0);
    level++;

    startLevel();

    // clearInterval(enemyTimer);  
    // levelDisplay = document.getElementById('level');
    // levelDisplay.innerHTML = `level: ${level}`;
    // createEnemies();
    // if (INITIAL_SPEED - level * 100 > 500) {
        
    //     initEnemies(INITIAL_SPEED - level * 100);
    //     console.log("wtf");
    // } else if (INITIAL_SPEED - 600 - (level - 6) * 10 > MAX_SPEED) {
    //     initEnemies(INITIAL_SPEED - 600 - (level - 6) * 10);
    //     console.log(INITIAL_SPEED - 600 - (level - 6) * 10);
    // } else {
    //     initEnemies(MAX_SPEED);
    //     console.log("???")
    // }
    
}


initGame();