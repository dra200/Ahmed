const board = document.getElementById('board');
const pieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'];

const player = 'player';
const computer = 'computer';

let selectedSquare = null;

function createBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = 'square';
            square.dataset.row = row;
            square.dataset.col = col;
            square.addEventListener('click', handleSquareClick);
            board.appendChild(square);

            if ((row + col) % 2 === 1) {
                square.style.backgroundColor = '#ddd';
            }

            if (row === 0 || row === 7) {
                square.innerHTML = pieces[col];
                square.dataset.piece = pieces[col];
                square.dataset.owner = player;
            }

            if (row === 1 || row === 6) {
                square.innerHTML = '♟';
                square.dataset.piece = '♟';
                square.dataset.owner = player;
            }
        }
    }
}

function handleSquareClick(event) {
    const clickedSquare = event.target;

    if (!selectedSquare) {
        handleSelection(clickedSquare);
    } else {
        handleMove(clickedSquare);
    }
}

function handleSelection(square) {
    if (square.dataset.owner === player) {
        resetSelection();
        selectedSquare = square;
        square.classList.add('selected');
        highlightPossibleMoves(square);
    }
}

function handleMove(square) {
    if (square.classList.contains('highlight')) {
        square.innerHTML = selectedSquare.innerHTML;
        square.dataset.piece = selectedSquare.dataset.piece;
        square.dataset.owner = selectedSquare.dataset.owner;

        selectedSquare.innerHTML = '';
        selectedSquare.dataset.piece = '';
        selectedSquare.dataset.owner = '';

        switchTurn();
        makeComputerMove();
    } else {
        resetSelection();
        handleSelection(square);
    }
}

function resetSelection() {
    const highlightedSquares = document.querySelectorAll('.highlight');
    highlightedSquares.forEach(square => {
        square.classList.remove('highlight');
        square.removeEventListener('click', handleSquareClick);
    });

    if (selectedSquare) {
        selectedSquare.classList.remove('selected');
    }

    selectedSquare = null;
}

function highlightPossibleMoves(square) {
    const possibleMoves = getPossibleMoves(square);

    possibleMoves.forEach(move => {
        const moveSquare = getSquareByCoordinates(move.row, move.col);
        if (moveSquare && !moveSquare.dataset.piece) {
            moveSquare.classList.add('highlight');
            moveSquare.addEventListener('click', handleSquareClick);
        }
    });
}

function getPossibleMoves(square) {
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    const moves = [];

    switch (square.dataset.piece) {
        case '♜':
            moves.push(...getRookMoves(row, col));
            break;
        case '♞':
            moves.push(...getKnightMoves(row, col));
            break;
        case '♝':
            moves.push(...getBishopMoves(row, col));
            break;
        case '♛':
            moves.push(...getRookMoves(row, col));
            moves.push(...getBishopMoves(row, col));
            break;
        case '♚':
            moves.push(...getKingMoves(row, col));
            break;
        case '♟':
            moves.push(...getPawnMoves(row, col, square.dataset.owner));
            break;
    }

    return filterValidMoves(moves);
}

function getRookMoves(row, col) {
    const moves = [];
    for (let i = 0; i < 8; i++) {
        if (i !== row) {
            moves.push({ row: i, col: col });
        }
        if (i !== col) {
            moves.push({ row: row, col: i });
        }
    }
    return moves;
}

function getKnightMoves(row, col) {
    const moves = [
        { row: row - 2, col: col - 1 },
        { row: row - 2, col: col + 1 },
        { row: row - 1, col: col - 2 },
        { row: row - 1, col: col + 2 },
        { row: row + 1, col: col - 2 },
        { row: row + 1, col: col + 2 },
        { row: row + 2, col: col - 1 },
        { row: row + 2, col: col + 1 },
    ];
    return filterValidMoves(moves);
}

function getBishopMoves(row, col) {
    const moves = [];
    for (let i = 1; i < 8; i++) {
        moves.push({ row: row - i, col: col - i });
        moves.push({ row: row - i, col: col + i });
        moves.push({ row: row + i, col: col - i });
        moves.push({ row: row + i, col: col + i });
    }
    return moves;
}

function getKingMoves(row, col) {
    const moves = [
        { row: row - 1, col: col - 1 },
        { row: row - 1, col: col },
        { row: row - 1, col: col + 1 },
        { row: row, col: col - 1 },
        { row: row, col: col + 1 },
        { row: row + 1, col: col - 1 },
        { row: row + 1, col: col },
        { row: row + 1, col: col + 1 },
    ];
    return filterValidMoves(moves);
}

function getPawnMoves(row, col, owner) {
    const forward = (owner === player) ? -1 : 1;
    const moves = [
        { row: row + forward, col: col },
        { row: row + forward, col: col - 1 },
        { row: row + forward, col: col + 1 },
    ];
    return filterValidMoves(moves);
}

function filterValidMoves(moves) {
    return moves.filter(move => move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8)
                .map(move => ({ row: move.row, col: move.col }));
}

function getSquareByCoordinates(row, col) {
    return document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
}

function switchTurn() {
    // Implement your logic to switch turns
    // For now, let's assume it's always the player's turn
}

function makeComputerMove() {
    // Implement your AI logic here
    // For now, let's make a random move for the computer
    const emptySquares = document.querySelectorAll('.square:not([data-piece])');
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const randomSquare = emptySquares[randomIndex];

    if (randomSquare) {
        const computerPiece = getComputerPiece();
        randomSquare.innerHTML = computerPiece;
        randomSquare.dataset.piece = computerPiece;
        randomSquare.dataset.owner = computer;
    }
}

function getComputerPiece() {
    // Implement your logic to determine the computer's piece
    // For now, let's assume it's always the same piece
    return '♙';
}

createBoard();
