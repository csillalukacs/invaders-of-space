const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;
let player_pos = Math.floor(BOARD_WIDTH / 2);



function initGame() {
    createBoardDivs();
    const body = document.querySelector("body");
    body.addEventListener('keydown', movePlayer);
    draw();
}

// bal = 37, jobb = 39
function movePlayer(e){
    if (e.keyCode === 37){
        moveLeft();
        draw();
        
    } else if (e.keyCode === 39) {
        moveRight();
        draw();
        
    }
    
}

function moveLeft(){
    if (player_pos > 0 ) {
        player_pos--;
    }
}

function moveRight(){
    if (player_pos < BOARD_WIDTH - 1){
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

function draw(){

    let last_row = document.querySelectorAll('.square[data-row="19"]');
    last_row.forEach((cell)=> {cell.classList.remove("player")});
    let player_cell = document.querySelector(`.square[data-row="19"][data-col="${player_pos}"]`);
    player_cell.classList.add("player");
}

initGame();