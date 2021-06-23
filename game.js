const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 15;
const CELL_SIZE = 36;
const COOLDOWN = 0.2;
const SCORE_MULTIPLIER = 0.25;
const INITIAL_SPEED = 1000;
const MAX_SPEED = 400;
const projectiles = [];
const enemies = [];
const enemyProjectiles =[];


let player_pos = Math.floor(BOARD_WIDTH / 2);
let lastShot = new Date();
let direction = 1;
let gameOver = false;
let enemyTimer = null;
let level = 0;
let score = 0;
let lives = 3;
let canShoot = false;
let enemyProjectileTimer = 0;
let boss_alive = false;
let countOfAllEnemies = 0;
let ufoSpawnCount = 0;


function initGame() {
    createBoardDivs();
    const body = document.querySelector("body");
    body.addEventListener('keydown', movePlayer);
    body.addEventListener('keypress', shoot);
    let livesDisplay = document.getElementById('lives');
    livesDisplay.innerHTML = `lives: ${lives}`;
    startLevel();
}

function startLevel() {
    draw();

    countOfAllEnemies = 0;
    ufoSpawnCount = 0;
    clearInterval(enemyTimer);
    let enemyCells = document.querySelectorAll(".enemy")
    enemyCells.forEach((cell)=>{
        cell.classList.remove("enemy");
        for (let cl of cell.classList){
            if (cl.includes("type")){
                cell.classList.remove(cl);
            }
        }
    })
    enemies.splice(0, enemies.length);
    clearInterval(enemyProjectileTimer);
    enemyProjectiles.splice(0,enemyProjectiles.length)

    for (let projectile of projectiles){
        clearInterval(projectile.timer);
    }
    projectiles.splice(0,projectiles.length);
    const projectileCells = document.querySelectorAll(".bullet");
    projectileCells.forEach((cell)=>cell.classList.remove("bullet"));


    let levelDisplay = document.getElementById('level');
    levelDisplay.innerHTML = `level: ${level}`;

    createEnemies();
    if (INITIAL_SPEED - level * 100 > 500) {
        initEnemies(INITIAL_SPEED - level * 100);
    } else if (INITIAL_SPEED - 500 - (level - 6) * 10 > MAX_SPEED) {
        initEnemies(INITIAL_SPEED - 500 - (level - 6) * 10);
    } else {
        initEnemies(MAX_SPEED);
    }
    draw();


    enemyProjectileTimer = setInterval(enemyShoot, 750)
    canShoot = true;
}

function createEnemies() {
    for (let i = 5; i < BOARD_WIDTH - 5; i++) {
        for (let j = 3; j < BOARD_HEIGHT - 3; j++) {
            if ((j + 1) % 3 !== 0) {
                addEnemy(i, j, (4 - Math.floor(j / 3)))
                countOfAllEnemies ++;
            }
        }
    }
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
                let livesDisplay = document.getElementById('lives');
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

        console.log(enemies);
        let currentTime = new Date();
        if ((lastShot.getTime() / 1000 + COOLDOWN < currentTime.getTime() / 1000) && canShoot) {
            let newProjectile = { x: player_pos, y: BOARD_HEIGHT - 2 }
            projectiles.push(newProjectile);
            newProjectile.timer = setInterval(() => updateProjectile(newProjectile), 50);
            draw();
            lastShot = new Date();
        }
    }
}

function enemyShoot() {
    if (!gameOver){

        let randEnemy = enemies[Math.floor(Math.random() * enemies.length)];
        if (randEnemy.y < BOARD_HEIGHT - 5){
            let newProjectile = { x: randEnemy.x, y: randEnemy.y + 1 }
            enemyProjectiles.push(newProjectile);
            newProjectile.timer = setInterval(() => updateEnemyProjectile(newProjectile), 140);
            draw();
        }
    }
}

function updateProjectile(projectile) {
    if (!gameOver) {
        if (enemyAt(projectile.x, projectile.y)) {
            clearInterval(projectile.timer);
            let index = projectiles.indexOf(projectile);
            projectiles.splice(index, 1);
        } else if (projectile.y > 0) {
            projectile.y--;
        } else {
            clearInterval(projectile.timer);
            let index = projectiles.indexOf(projectile);
            projectiles.splice(index, 1);
        }
        draw();
    }
}

function updateEnemyProjectile(enemyProjectile) {
    if (!gameOver) {
        if (enemyAt(enemyProjectile.x, enemyProjectile.y, true)) {
            clearInterval(enemyProjectile.timer);
            let index = enemyProjectiles.indexOf(enemyProjectile);
            enemyProjectiles.splice(index, 1);
        } else if (enemyProjectile.y < BOARD_HEIGHT - 1) {
            enemyProjectile.y++;
        } else {
            clearInterval(enemyProjectile.timer);
            let index = enemyProjectiles.indexOf(enemyProjectile);
            enemyProjectiles.splice(index, 1);
        }
        draw();
    }
}

function enemyAt(x, y, targetIsPlayer=false) {
    let cell = document.querySelector(`.square[data-row="${y}"][data-col="${x}"]`);
    if (cell.classList.contains("enemy") && targetIsPlayer === false) {
        cell.classList.remove("enemy");

        for (let cl of cell.classList) {
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
        let scoreDisplay = document.getElementById('score');
        scoreDisplay.innerHTML = `score: ${score}`;

        if (enemies.length / countOfAllEnemies * 100 < 75 && ufoSpawnCount === 0){
            ufoSpawn();
            ufoSpawnCount ++;
        }
        else if(enemies.length / countOfAllEnemies * 100 < 40 && ufoSpawnCount === 1){
            ufoSpawn();
            ufoSpawnCount ++;
        }
        else if (enemies.length === 0) {
            win();
        }
        return true;
    }
    else if (y === BOARD_HEIGHT-1){
        let target = document.querySelector(`.square[data-row="${y}"][data-col="${x}"]`);
        if (target.classList.contains('player')){
            lives -= 1;
            let livesDisplay = document.getElementById('lives');
            livesDisplay.innerHTML = `lives: ${lives}`;
            if (lives === 0){
                lose();
            }
            return true;
        }
    }
    if (cell.classList.contains("boss")) {
        cell.classList.remove("boss");
        boss_alive = false;
        score += 300;
        let scoreDisplay = document.getElementById('score');
        scoreDisplay.innerHTML = `score: ${score}`;
        return true;
    }
}

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

    for (let projectile of projectiles) {
        let projectileCell = document.querySelector(`.square[data-row="${projectile.y}"][data-col="${projectile.x}"]`)
        projectileCell.classList.add("bullet");
    }
    cells.forEach((cell) => { cell.classList.remove("enemy_bullet") });

    for (let enemyProjectile of enemyProjectiles) {
        let projectileCell = document.querySelector(`.square[data-row="${enemyProjectile.y}"][data-col="${enemyProjectile.x}"]`)
        projectileCell.classList.add("enemy_bullet");
    }
}

function drawEnemies() {
    let enemyCells = document.querySelectorAll(".enemy");
    enemyCells.forEach((cell) => {
        cell.classList.remove("enemy");
        for (let cl of cell.classList) {
            if (cl.includes("type")) {
                cell.classList.remove(cl);
            }
        }
    });

    for (let enemy of enemies) {
        let enemyCell = document.querySelector(`.square[data-row="${enemy.y}"][data-col="${enemy.x}"]`);
        enemyCell.classList.add("enemy");
        enemyCell.classList.add(`type${enemy.type}`);
    }
}

function lose() {
    gameOver = true;
    alert('You lost!');

}

function win() {
    canShoot = false;
    setTimeout(() => { alert('Next wave is coming! Get ready! '); }, 10);
    level++;
    startLevel();
}

function ufoSpawn () {
    boss_alive = true;
    let spawnPoint = Math.floor(Math.random() * 2);
    let direction = 1;
    if (spawnPoint === 1) {
        spawnPoint = BOARD_WIDTH - 1;
        direction = -1;
    }
    let bossLocation = spawnPoint - direction;
    let boss_move = setInterval(function(){
        if (!gameOver) {
            bossLocation += direction;
            if (bossLocation === BOARD_WIDTH || bossLocation === -1 || boss_alive === false) {
                let boss = document.querySelector(`.square[data-row="${0}"][data-col="${bossLocation - direction}"]`);
                boss.classList.remove('boss');
                clearInterval(boss_move);

            }
            if (boss_alive === true) {
                let newBoss = document.querySelector(`.square[data-row="${0}"][data-col="${bossLocation}"]`);
                newBoss.classList.toggle('boss');
                let boss = document.querySelector(`.square[data-row="${0}"][data-col="${bossLocation - direction}"]`);
                boss.classList.toggle('boss');
            }
        }
    }, 400);
}



initGame();