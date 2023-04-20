function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player.token;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function Gameboard() {
    const ROWS = 3;
    const COLS = 3;
    const board = [];

    for (let i = 0; i < ROWS; i++) {
        board[i] = [];
        for (let j = 0; j < COLS; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithValues = board.map((row) =>
            row.map((cell) => cell.getValue())
        );
        // console.log(boardWithValues);
    };

    const selectCell = (row, column, player) => {
        let cellValue = board[row][column].getValue();
        if (cellValue !== "") return false;
        board[row][column].addToken(player);
        return true;
    };

    const hasWon = () => {
        // check rows
        for (let i = 0; i < ROWS; i++) {
            if (
                board[i][0].getValue() === board[i][1].getValue() &&
                board[i][0].getValue() === board[i][2].getValue() &&
                board[i][0].getValue() !== ""
            ) {
                return true;
            }
        }

        // check columns
        for (let i = 0; i < COLS; i++) {
            if (
                board[0][i].getValue() === board[1][i].getValue() &&
                board[0][i].getValue() === board[2][i].getValue() &&
                board[0][i].getValue() !== ""
            ) {
                return true;
            }
        }

        // check diagonals
        if (
            board[0][0].getValue() === board[1][1].getValue() &&
            board[0][0].getValue() === board[2][2].getValue() &&
            board[0][0].getValue() !== ""
        ) {
            return true;
        }

        if (
            board[0][2].getValue() === board[1][1].getValue() &&
            board[0][2].getValue() === board[2][0].getValue() &&
            board[0][2].getValue() !== ""
        ) {
            return true;
        }

        return false;
    };

    const isFull = () => {
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLS; j++) {
                if (board[i][j].getValue() == "") return false;
            }
        }

        return true;
    };

    return { getBoard, printBoard, selectCell, hasWon, isFull };
}

function Gamecontroller(playerOne = "Player One", playerTwo = "Player Two") {
    const board = Gameboard();
    const playerTurn = document.querySelector('.turn');

    const players = [
        { name: playerOne, token: "X" },
        { name: playerTwo, token: "O" },
    ];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    // const printNewRound = () => {
    //     board.printBoard();
    //     console.log(`${getActivePlayer().name}'s turn`);
    // };

    const playRound = (row, column) => {
        // console.log(`Selecting cell (${row}, ${column})`);
        if(!board.selectCell(row, column, getActivePlayer())) return;

        if (board.hasWon() == true) {
            playerTurn.textContent = `${getActivePlayer().name} has Won!!!`;   
            // console.log(`${getActivePlayer().name} has won`);
        }

        if (board.isFull() == true) {
            playerTurn.textContent = "It's a Tie!!!";
            // console.log("Tie");
        }

        
        switchPlayer();
        // printNewRound();
        if(!board.hasWon() && !board.isFull())
            playerTurn.textContent = `${getActivePlayer().name}'s turn...`;
    };
    
    // printNewRound();
    playerTurn.textContent = `${getActivePlayer().name}'s turn...`;

    return { playRound, getBoard: board.getBoard, hasWon: board.hasWon, isFull: board.isFull };
}

function Screencontroller() {
    const game = Gamecontroller();
    const container = document.querySelector('.container');
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        boardDiv.textContent = "";

        const board = game.getBoard();

        board.forEach((row, rInd) => {
            row.forEach((cell, cInd) => {
                const cellButton = document.createElement("button");
                cellButton.className = "cell";
                cellButton.textContent = cell.getValue();
                cellButton.dataset.row = rInd;
                cellButton.dataset.column = cInd;
                boardDiv.appendChild(cellButton);
            });
        });
    };

    function clickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();

        if (game.hasWon() || game.isFull()) {
            boardDiv.removeEventListener("click", clickHandler);
            const refreshText = document.createElement('p');
            refreshText.textContent = 'Please refresh the page';
            container.appendChild(refreshText);
        }
    }

    boardDiv.addEventListener("click", clickHandler);

    updateScreen();
}

Screencontroller();
