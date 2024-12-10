/* 
this is an Immediately Invoked Function Expression (IIFE), it's just like a
factory function but it's used when you only need one instance of something
*/
const gameboard = (function (){
    const gameboardArray = [];
     
    //this adds empty slots into the array, allowing to insert an item anywhere 
    gameboardArray.length = 9;

    const addMarker = (name, marker) => {
        while (true) {
            console.log(gameboardArray);
            let index = parseInt(prompt(`${name}, choose a position [0-8]:`));

            if (typeof index !== "number" || index > 8) {
                console.log("choose a number between [0-8]");
                continue
            }
            if (gameboardArray[index] === undefined) {
                gameboardArray.splice(index, 1, marker);
                break
            } else {
                console.log(`Item at ${index} has already been set`);
            }
        }
    };

    // checks if a row, column or diagonal has been filled with the specified marker
    const checkWin = (marker) => {
        if (gameboardArray.filter((item, index) => item === marker && index <= 2).length === 3) {
            console.log("first row");
            return true
        } else if (gameboardArray.filter((item, index) => item === marker && index >= 3 && index <= 5).length === 3) {
            console.log("second row");
            return true
        } else if (gameboardArray.filter((item, index) => item === marker && index >= 6).length === 3) {
            console.log("third row");
            return true
            /* 
            creates an array based of the array of indexes, which is then
            filtered to have only items with the specified marker. If the
            length is less than 3, it means the win condition have not been met
            */
        } else if ([0, 3, 6].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            console.log("first column");
            return true
        } else if ([1, 4, 7].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            console.log("second column");
            return true
        } else if ([2, 5, 8].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            console.log("third column");
            return true
        } else if ([0, 4, 8].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            console.log("top-left to bottom-right diagonal");
            return true
        } else if ([6, 4, 2].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            console.log("bottom-left to top-right diagonal");
            return true
        } else if (gameboardArray.length === 9 && !gameboardArray.includes(undefined)) {
            console.log("draw");
            return true
        } else {
            return false
        }
    }

    const resetGame = () => {
        for (let i = 0; i < 9; i++) {
            delete gameboardArray[i];
        }
    }

    return {addMarker, checkWin, resetGame};
})();

/* 
this is a factory function, it's similar to an object constructor, but doesn't
need the new keyword
*/
function createPlayer(name, marker) {
    const playerName = name;
    const playerMarker = marker;
    let wins = 0;

    const addMarker = function() {
        gameboard.addMarker(playerName, playerMarker);
    }

    const addWin = () => wins++;
    const getWins = () => wins;

    return {playerName, playerMarker, addMarker, addWin, getWins};
}

const gameboardFlow = (function() {

    const playGame = function(playerOne, playerTwo) {
        let currentPlayer = playerOne;
        let nextPlayer = playerTwo;

        while (true) {
            currentPlayer.addMarker();
            
            if(gameboard.checkWin(currentPlayer.playerMarker)) {
                console.log(`${currentPlayer.playerName} is the winner!`)
                currentPlayer.addWin();
                break
            }

            // handles players turns
            if (nextPlayer === playerTwo) {
                currentPlayer = playerTwo;
                nextPlayer = playerOne;
            } else if (nextPlayer === playerOne) {
                currentPlayer = playerOne;
                nextPlayer = playerTwo;
            }
        }
        gameboard.resetGame();

    }
    return {playGame};
})();

const jog1 = createPlayer("Jog1", "x");
const jog2 = createPlayer("Jog2", "o");

gameboardFlow.playGame(jog1, jog2);