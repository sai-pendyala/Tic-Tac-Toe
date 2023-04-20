function Gameboard() {
    const ROWS = 3;
    const COLS = 3;
    const board = [];

    for(let i = 0; i < ROWS; i++) {
        board[i] = [];
        for(let j = 0; j < COLS; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithValues);
    }

    const selectCell = (row, column, player) => {
        let cellValue = board[row][column].getValue();
        if(cellValue !== "")
            return
        board[row][column].addToken(player);
    }

    const hasWon = () => {
        for(let i = 0; i < ROWS; i++) {
            if( 
                board[i][0].getValue() != "" && 
                board[i][1].getValue() != "" &&
                board[i][2].getValue() != "" &&  
                board[i][0].getValue() == board[i][1].getValue() && 
                board[i][1].getValue() == board[i][2].getValue()
                )
                return true;
        }

        for(let i = 0; i < COLS; i++) {
            if(
                board[0][i].getValue() != "" && 
                board[1][i].getValue() != "" &&
                board[2][i].getValue() != "" &&  
                board[0][i].getValue() == board[1][i].getValue() && 
                board[1][i].getValue() == board[2][i].getValue()
                )
                return true;
        }

        if( 
            board[0][0].getValue() != "" && 
            board[1][1].getValue() != "" &&
            board[2][2].getValue() != "" &&  
            board[0][0].getValue() == board[1][1].getValue() && 
            board[1][1].getValue() == board[2][2].getValue()
            )
            return true;
        
        if(
            board[0][2].getValue() != "" && 
            board[1][1].getValue() != "" &&
            board[2][0].getValue() != "" &&  
            board[0][2].getValue() == board[1][1].getValue() && 
            board[1][1].getValue() == board[2][0].getValue()
            )
            return true
        
        return false;
    }

    const isFull = () => {
        for(let i = 0; i < ROWS; i++) {
            for(let j = 0; j < COLS; j++) {
                if(board[i][j].getValue() == "")
                    return false;
            }
        }

        return true;
    }

    return {getBoard, printBoard, selectCell, hasWon, isFull};
}

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player.token;
    }

    const getValue = () => value;

    return {addToken, getValue};
}

function Gamecontroller(playerOne = "Player One", playerTwo = "Player Two") {
    const board = Gameboard();

    const players = [{name: playerOne, token: "X"}, {name: playerTwo, token: "O"}];

    let activePlayer = players[0];

    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    }

    const playRound = (row, column) => {
        console.log(`Selecting cell (${row}, ${column})`);
        board.selectCell(row, column, getActivePlayer());
        
        if(board.hasWon() == true) {
            console.log(`${getActivePlayer().name} has won`);
            process.exit(0);
        }

        if(board.isFull() == true) {
            console.log("Tie");
            process.exit(0);
        }

        switchPlayer();
        printNewRound();
    } 

    printNewRound();

    return {playRound};
}

const game = Gamecontroller();