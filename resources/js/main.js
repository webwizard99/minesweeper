const MinefieldController = (function(){
    
    // gridSize variable stores size of grid for game
    let gridSize = {
        height: 3,
        width: 3
    }

    let gameGrid = [];

    return {
        setGridSize: function(h, w) {
            // if grid dimensions aren't numbers
            // above zero, quit
            if (!(h > 0 && w > 0)) {
                return;
            } else {
                gridSize.height = h;
                gridSize.width = w;
            }
        },
        
        getGridSize: function() {
            return gridSize;
        },

        populateGrid: function() {
            
            // create temporary 2D array for gameboard
            let boardDepth = gridSize.height;
            let boardT = [];
            for (let arrIndex = 0; arrIndex < boardDepth; arrIndex++) {
                boardT[arrIndex] = [];
            }
            
            // determine number of bombs
            let bombs = Math.floor((gridSize.height * gridSize.width) / 6);

            // generate array for volume of bombs and
            // free tiles, and array for randomized
            let totalTiles = [], randomTiles = [];
            
            // add bombs and freespaces to array
            for (let b = 0; b < bombs; b++) {
                totalTiles.push(true);
            }
            for (let f = 0; f < ((gridSize.height * gridSize.width) - bombs); f++) {
                totalTiles.push(false);
            }

            // distribute tiles randomly
            while (totalTiles.length > 0) {
                const randomIndex = Math.floor(Math.random() * totalTiles.length);
                var randomValue = totalTiles.splice(randomIndex, 1);
                randomTiles.push(randomValue[0]);
            }

            // clear game grid
            gameGrid = [];
            //gameGrid[1][1] = false;

            for (let rowT = 0; rowT < gridSize.height; rowT++) {
                for (let colT = 0; colT < gridSize.width; colT++) {
                    boardT[rowT][colT] = randomTiles.shift();
                    
                }
            }

            gameGrid = boardT;
            console.table(gameGrid);

            
        }
    }
})();

const UIController = (function(){
    const tileTemplate = `
        <div class="tile %status%" data-show="%show%" data-index="%r%-%c%">
        </div>
        `;

    const rowBegin = `
        <div class="row mine-row">
    `;

    const rowEnd = `
        </div>
    `;

    return {
        drawGrid: function(h,w) {
            let board = document.getElementById('minesweeper-board');
            board.innerHTML = null;

            let boardT = '';

            // iterate over number of rows (h)
            for (let rowN = 0; rowN < h; rowN++) {
                boardT += rowBegin;

                // iterate over number of columns
                // to create a tile for each
                for (let colN = 0; colN < w; colN++) {
                    let Ttile = tileTemplate;
                    Ttile = Ttile.replace('%status%', 'unrevealed');
                    Ttile = Ttile.replace('%r%', (rowN + 1).toString());
                    Ttile = Ttile.replace('%c%', (colN + 1).toString());

                    boardT += Ttile;
                }

                boardT += rowEnd

            }

            board.innerHTML = boardT;
        }
    }
})();

const Controller = (function(MineCtrl, UICtrl){
    const setEventListeners = function() {

    }

    const startNewGame = function() {
        
        // 1. Set the size of the minefield to the
        // values chosen in the interface
        // in the MinefieldController
        // temporary code to set a grid size
        MineCtrl.setGridSize(8,8);

        // 2. Get the value of the minefield size
        const gameSize = MineCtrl.getGridSize();

        // 3. Set the mines in the minefield Controller
        MineCtrl.populateGrid();

        // 4. Draw the minefield with the UIController
        UICtrl.drawGrid(gameSize.height, gameSize.width);

    }
    
    return {
        init: function() {
            // 1. Establish event listeners
            setEventListeners();

            // 2. Start a new game
            startNewGame();
        }
    }
})(MinefieldController, UIController);

Controller.init();