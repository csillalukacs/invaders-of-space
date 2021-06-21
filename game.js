const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;
const COOLDOWN = 1;

let player_pos = Math.floor(BOARD_WIDTH / 2);
let projectiles = [];
let lastShot = new Date();


function initGame() {
    createBoardDivs();
    const body = document.querySelector("body");
    body.addEventListener('keydown', movePlayer);
    body.addEventListener('keypress', shoot);
    draw();
}


function shoot(e) {

    if (e.keyCode === 32) {
        var currentTime = new Date();
        if (lastShot.getTime() / 1000 + COOLDOWN < currentTime.getTime() / 1000 ) {
            let newProjectile = { x: player_pos, y: 18 }
            projectiles.push(newProjectile);
            let timer = setInterval(() => updateProjectile(newProjectile, timer), 250);
            draw();
            lastShot = new Date();
        }
    }

}


function updateProjectile(projectile, timer) {
    console.log(projectiles)
    if (projectile.y > 0) {
        projectile.y--;
    } else {
        clearInterval(timer);
        index = projectiles.indexOf(projectile);
        projectiles.splice(index, 1);
       
    }

    draw();
}

// function shoot(e) {
//     if (e.keyCode === 32) {
//         let col = player_pos;
//         row = BOARD_HEIGHT - 2;
//         bulletPos = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
//         bulletPos.classList.add("bullet");
//         for (let i = 0; i < BOARD_HEIGHT; i++) {
//             setTimeout(function(){
//                 bulletPos.classList.toggle("bullet");
//                 bulletPos = document.querySelector(`.square[data-row="${row-i}"][data-col="${col}"]`);
//                 bulletPos.classList.toggle("bullet");
//             }, 100*i);
//         }
//     }
// }


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
    for (let i = 0; i < 400; i++) {
        if (i % 20 === 0) {
            row++;
        }
        grid.insertAdjacentHTML(
            'beforeend',
            `<div class="square" data-row="${row}" data-col="${(i % 20)}"></div>`
        );
    }

    const cells = document.querySelectorAll(".grid div");

    cells.forEach((cell) => {
        cell.style.width = `${CELL_SIZE}px`;
        cell.style.height = `${CELL_SIZE}px`;
    });


}

function draw() {

    let lastRow = document.querySelectorAll('.square[data-row="19"]');
    lastRow.forEach((cell) => { cell.classList.remove("player") });
    let playerCell = document.querySelector(`.square[data-row="19"][data-col="${player_pos}"]`);
    playerCell.classList.add("player");

    let cells = document.querySelectorAll(".square");
    cells.forEach((cell) => { cell.classList.remove("bullet") });

    for (projectile of projectiles) {
        projectileCell = document.querySelector(`.square[data-row="${projectile.y}"][data-col="${projectile.x}"]`)
        projectileCell.classList.add("bullet");
    }

}



initGame();