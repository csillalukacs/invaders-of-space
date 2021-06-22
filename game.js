const BOARD_WIDTH = 19;
const BOARD_HEIGHT = 15;
const CELL_SIZE = 36;
const COOLDOWN = 1;

let player_pos = Math.floor(BOARD_WIDTH / 2);
const projectiles = [];
const enemies = [];
let lastShot = new Date();
let enemyStep = 0;


function initGame() {
    createBoardDivs();
    const body = document.querySelector("body");
    body.addEventListener('keydown', movePlayer);
    body.addEventListener('keypress', shoot);
    createEnemies();
    draw();
}

function createEnemies() {
    for (let i = 3; i < BOARD_WIDTH - 3; i++) {
        for (let j = 3; j < BOARD_HEIGHT - 3; j++) {
            if ((j + 1) % 3 !== 0) { addEnemy(i, j) }
        }
    }
    let enemyTimer = setInterval(updateEnemies, 1000);


}

function updateEnemies() {
    if (enemyStep % 2 === 0){
        for (let enemy of enemies){
            enemy.x++;
        }
    } else if (enemyStep % 2 === 1){
        for (let enemy of enemies){
            enemy.x--;
        }
    }
    enemyStep++;
    
    drawEnemies();
}

function addEnemy(x, y) {
    let newEnemy = { x: x, y: y, step: 0 };
    enemies.push(newEnemy);
    //let enemyTimer = setInterval(()=> {updateEnemy(newEnemy)}, 2000);

}


function shoot(e) {
    if (e.keyCode === 32) {
        var currentTime = new Date();
        if (lastShot.getTime() / 1000 + COOLDOWN < currentTime.getTime() / 1000) {
            let newProjectile = { x: player_pos, y: BOARD_HEIGHT - 2 }
            projectiles.push(newProjectile);
            let timer = setInterval(() => updateProjectile(newProjectile, timer), 250);
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


function updateEnemy(enemy) {
    if (enemy.step % 2 === 0) {
        enemy.x--;
        enemy.step++;
    } else if (enemy.step % 2 === 1) {
        enemy.x++;
        enemy.step++;
    }
    drawEnemies();
}


function enemyAt(x, y) {
    cell = document.querySelector(`.square[data-row="${y}"][data-col="${x}"]`);
    if (cell.classList.contains("enemy")) {
        cell.classList.remove("enemy");
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].x === x && enemies[i].y === y) {
                enemies.splice(i, 1);
            }
        }
        return true;
    }
}

// bal = 37, jobb = 39
function movePlayer(e) {
    if (e.keyCode === 37) {
        moveLeft();
        draw();

    } else if (e.keyCode === 39) {
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
    enemyCells.forEach((cell) => { cell.classList.remove("enemy") });

    for (enemy of enemies) {
        enemyCell = document.querySelector(`.square[data-row="${enemy.y}"][data-col="${enemy.x}"]`)
        enemyCell.classList.add("enemy");
    }
}



initGame();