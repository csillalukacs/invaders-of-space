initGame();

function initGame() {
    createBoardDivs();
}
function createBoardDivs() {
    const grid = document.querySelector('.grid');
    let row = -1;
    for (let i = 0; i < 400; i++) {
        if (i % 20 === 0) {
            row++;
        }
        grid.insertAdjacentHTML(
            'beforeend',
            `<div class="square" data-row="${row}" data-col="${(i%20)}"></div>`
        );
    }
}
