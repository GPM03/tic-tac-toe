/* 
this is an Immediately Invoked Function Expression (IIFE), it's just like a
factory function but it's used when you only need one instance of something
*/
const gameboard = (function (){
    const gameboardArray = [];

    // these variables store the player object
    let playerOne;
    let playerTwo;

    // used to alternate whos the first player each new round
    let firstPlayer;

    let currentPlayer;
    let nextPlayer;
     
    // this adds empty slots into the array, allowing to insert an item anywhere 
    gameboardArray.length = 9;

    const getArray = () => gameboardArray;

    // adds a item to the array with given index
    const addMarker = (index) => {
        if (gameboardArray[index] === undefined) {
            gameboardArray.splice(index, 1, gameboard.currentPlayer.getMarker());

            if (gameboard.checkWin(gameboard.currentPlayer.getMarker()) !== "ongoing") {
                gameboard.gameStart = false;
                if (gameboard.checkWin(gameboard.currentPlayer.getMarker()) === "draw") {
                    gameboardDisplay.roundEnd("Draw!");
                } else {
                    console.log(gameboard.checkWin(gameboard.currentPlayer.getMarker()));
                    gameboardDisplay.roundEnd(`${gameboard.currentPlayer.name} is the winner!`);
                    gameboard.currentPlayer.addWin();   
                }
            } else {
                // handles players turns
                if (gameboard.nextPlayer === gameboard.playerTwo) {
                    gameboard.currentPlayer = gameboard.playerTwo;
                    gameboard.nextPlayer = gameboard.playerOne;
                } else if (gameboard.nextPlayer === gameboard.playerOne) {
                    gameboard.currentPlayer = gameboard.playerOne;
                    gameboard.nextPlayer = gameboard.playerTwo;
                }

                gameboardDisplay.update();
            }
        } else {
            console.log(`Item at ${index} has already been set`);
        }
    }

    // checks if a row, column or diagonal has been filled with the specified marker
    const checkWin = (marker) => {
        if (gameboardArray.filter((item, index) => item === marker && index <= 2).length === 3) {
            return "first row"

        } else if (gameboardArray.filter((item, index) => item === marker && index >= 3 && index <= 5).length === 3) {
            return "second row"

        } else if (gameboardArray.filter((item, index) => item === marker && index >= 6).length === 3) {
            return "third row"

            /* 
            creates an array based of the array of indexes, which is then
            filtered to have only items with the specified marker. If the
            length is less than 3, it means the win condition have not been met
            */
        } else if ([0, 3, 6].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            return "first column"

        } else if ([1, 4, 7].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            return "second column"

        } else if ([2, 5, 8].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            return "third column"

        } else if ([0, 4, 8].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            return "top-left to bottom-right diagonal"

        } else if ([6, 4, 2].map((index) => gameboardArray[index]).filter((item) => item === marker).length === 3) {
            return "bottom-left to top-right diagonal"

        } else if (gameboardArray.length === 9 && !gameboardArray.includes(undefined)) {
            return "draw"

        } else {
            return "ongoing"
        }
    }

    // reset array
    const resetGame = () => {
        for (let i = 0; i < 9; i++) {
            delete gameboardArray[i];
        }
    }


    return {addMarker, checkWin, resetGame, getArray, playerOne, playerTwo, currentPlayer, nextPlayer, firstPlayer};
})();

/* 
this is a factory function, it's similar to an object constructor, but doesn't
need the new keyword
*/
const createPlayer = function(playerName, playerMarker) {
    const name = playerName;
    let marker = playerMarker;

    const getMarker = () => marker;

    let wins = 0;

    const addWin = () => wins++;
    const getWins = () => wins;

    const switchMarker = function() {
        if (marker === "x") {
            marker = "o";
        } else if (marker === "o") {
            marker = "x";
        }
    }

    return {name, getMarker, addWin, getWins, switchMarker};
}

// renders the display
const gameboardDisplay = (function() {
    const controls = document.querySelector(".controls");
    const buttonStart = document.querySelector(".start");

    const grid = document.querySelector(".grid");

    const createGrid = function() {
        while (grid.lastChild) {
            grid.removeChild(grid.lastChild);
        }
        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.setAttribute("index", i);
            grid.appendChild(div);
        }
    }

    // add marker to the grid 
    const addMarker = function() {
        for (let i = 0; i < gameboard.getArray().length; i++) {
            const div = document.querySelector(`.grid > div[index="${i}"]`);
            if (gameboard.getArray()[i] === "x") {
                div.classList.add("cross");
            } else if (gameboard.getArray()[i] === "o") {
                div.classList.add("circle");
            }
        }
    }

    // displays player's info
    const addPlayer = function(player, container) {
        while (container.lastChild) {
            container.removeChild(container.lastChild);
        };

        const playerName = document.createElement("h2");
        const playerWins = document.createElement("span");
        const playerMarker = document.createElement("span");
        const markerImg = document.createElement("img");
        playerName.textContent = `${player.name}`;
        playerName.classList.add("name");
        playerWins.textContent = `Wins: ${player.getWins()}`;
        playerWins.classList.add("wins");
        playerMarker.textContent = "Marker: ";
        playerMarker.classList.add("marker-text");
        markerImg.classList.add("marker-img");

        if (player.getMarker() === "x") {
            markerImg.setAttribute("src", "materials/cross.png");
        } else if (player.getMarker() === "o") {
            markerImg.setAttribute("src", "materials/circle.png");
        }

        container.appendChild(playerName);
        container.appendChild(playerWins);
        playerMarker.appendChild(markerImg);
        container.appendChild(playerMarker);

    }

    // updates display
    const update = function() {
        const playerOneWins = document.querySelector(".player1 > .wins");
        const playerOneMarker = document.querySelector(".player1 .marker-img");
        const playerTwoWins = document.querySelector(".player2 > .wins");
        const playerTwoMarker = document.querySelector(".player2 .marker-img");
        const currentPlayerTurn = document.querySelector(".controls > .current-player");

        playerOneWins.textContent = `Wins: ${gameboard.playerOne.getWins()}`;

        if (gameboard.playerOne.getMarker() === "x") {
            playerOneMarker.setAttribute("src", "materials/cross.png");
        } else if (gameboard.playerOne.getMarker() === "o") {
            playerOneMarker.setAttribute("src", "materials/circle.png");
        }

        if (gameboard.playerTwo.getMarker() === "x") {
            playerTwoMarker.setAttribute("src", "materials/cross.png");
        } else if (gameboard.playerTwo.getMarker() === "o") {
            playerTwoMarker.setAttribute("src", "materials/circle.png");
        }

        playerTwoWins.textContent = `Wins: ${gameboard.playerTwo.getWins()}`;
        playerTwoMarker.textContent = `Marker: ${gameboard.playerTwo.getMarker()}`;
        currentPlayerTurn.textContent = `${gameboard.currentPlayer.name}'s turn`;
    }

    // displays round results and add button for next round
    const roundEnd = function(result) {
        while (controls.lastChild) {
            controls.removeChild(controls.lastChild);
        }

        const results = document.createElement("span");
        const nextRound = document.createElement("button");
        results.textContent = result;
        results.classList.add("results");
        nextRound.textContent = "Next round";
        nextRound.classList.add("next-round");
        nextRound.classList.add("button");
        nextRound.addEventListener("click", () => {
            while (controls.lastChild) {
                controls.removeChild(controls.lastChild);
            }
            const currentPlayerTurn = document.createElement("span");
            currentPlayerTurn.textContent = `${gameboard.currentPlayer.name}'s turn`;
            currentPlayerTurn.classList.add("current-player");
            controls.appendChild(currentPlayerTurn);
            gameboard.resetGame();
            createGrid();
            gameboardDisplay.update();
            gameboard.playerOne.switchMarker();
            gameboard.playerTwo.switchMarker();

            if (gameboard.firstPlayer === gameboard.playerOne) {
                gameboard.firstPlayer = gameboard.playerTwo;
                gameboard.currentPlayer = gameboard.playerTwo;
                gameboard.nextPlayer = gameboard.playerOne;
            } else if (gameboard.firstPlayer === gameboard.playerTwo) {
                gameboard.firstPlayer = gameboard.playerOne
                gameboard.currentPlayer = gameboard.playerOne;
                gameboard.nextPlayer = gameboard.playerTwo;
            }
            gameboard.gameStart = true;
            update();
        })

        controls.appendChild(results);
        controls.appendChild(nextRound);
    }

    createGrid();

    buttonStart.addEventListener("click", () => {
        while (controls.lastChild) {
            controls.removeChild(controls.lastChild);
        }
        gameboardController.startGame();

        const currentPlayerTurn = document.createElement("span");
        currentPlayerTurn.textContent = `${gameboard.currentPlayer.name}'s turn`;
        currentPlayerTurn.classList.add("current-player");

        controls.appendChild(currentPlayerTurn);

    })

    return {addMarker, addPlayer, update, roundEnd, grid};
})();

// interacts with user input
const gameboardController = (function(){
    let playerOneName;
    let playerTwoName;

    // gets all the needed info to start the game
    const startGame = function() {
        playerOneName = document.querySelector('input[name="player1"]').value;
        playerTwoName = document.querySelector('input[name="player2"]').value;

        const playerOneContainer = document.querySelector(".player1");
        const playerTwoContainer = document.querySelector(".player2");

        if (playerOneName === "") {
            playerOneName = "Player 1";
        }

        if (playerTwoName === "") {
            playerTwoName = "Player 2";
        }

        gameboard.playerOne = createPlayer(playerOneName, "x");
        gameboard.playerTwo = createPlayer(playerTwoName, "o");

        gameboard.currentPlayer = gameboard.playerOne;
        gameboard.nextPlayer = gameboard.playerTwo;

        gameboard.firstPlayer = gameboard.playerOne;

        gameboardDisplay.addPlayer(gameboard.playerOne, playerOneContainer);
        gameboardDisplay.addPlayer(gameboard.playerTwo, playerTwoContainer);

        gameboard.gameStart = true;

    }

    document.addEventListener("click", (e) => {
        if (gameboardDisplay.grid.contains(e.target) && gameboard.gameStart) {
            let index = e.target.getAttribute("index");
            if (index) {
                gameboard.addMarker(index);
                gameboardDisplay.addMarker();
            }
        }
    })

    return {startGame}
})();