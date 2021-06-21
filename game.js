


const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 30;
let player_pos = Math.floor(BOARD_WIDTH / 2);




function initGame() {
    createBoardDivs();
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



initGame();