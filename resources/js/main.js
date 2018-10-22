// ------------ ***** ----------
// MinefieldController for minefield logic
// ------------ ***** ----------
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

        populateGrid: function(diff) {
            


            // create temporary 2D array for gameboard
            let boardDepth = gridSize.height;
            let boardT = [];
            for (let arrIndex = 0; arrIndex < boardDepth; arrIndex++) {
                boardT[arrIndex] = [];
            }
            
            // determine number of bombs
            let bombs = Math.floor((gridSize.height * gridSize.width) * ((diff * 4) / 100));

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

            gameGrid = boardT; //.slice(0,boardT.length);
            

        },

        checkTile: function(r, c) {
            
            // if tile has bomb return true
            if (gameGrid[r - 1][c - 1]) {
                return true;
            } else {
                return false;
            }
        },
        
    }
})();


// ------------ ***** ----------
// UIController for UI manipulation
// ------------ ***** ----------
const UIController = (function(){
    const DOMStrings = {
        minesweeperBoard: '#minesweeper-board',
        tile: '.tile',
        start: '#start',
        size: '#size',
        difficulty: '#difficulty',
        sizeDisplay: '#size-display',
        diffDisplay: '#difficulty-display'
    }

    const colors = [
        {r: 'ff', g:'00', b:'00'},
        {r: '00', g:'ff', b:'00'},
        {r: '00', g:'00', b:'ff'},
        {r: 'ff', g:'ff', b:'00'},
        {r: 'ff', g:'00', b:'ff'},
        {r: '00', g:'ff', b:'ff'},
        {r: 'ff', g:'77', b:'77'},
        {r: '77', g:'ff', b:'77'},
        {r: '77', g:'77', b:'ff'}
    ];
    
    // templates for drawing minefield
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

    //public methods
    return {
        drawGrid: function(h, w) {
            let board = document.querySelector(DOMStrings.minesweeperBoard);
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
            
            board.style.width = `${(w * 28) + 30}px`;
        },

        getDomStrings: function() {
            return DOMStrings;
        },

        showBomb: function(r, c) {
            const locString = r + '-' + c;
            let originTile = document.
                querySelector(`[data-index="${locString}"]`);
            originTile.style.backgroundColor = 'red';
            originTile.innerHTML = `<i class="fa fa-bomb tile-contents"></i>`;
        },

        revealTile: function(r, c, num) {
            let tile = document.querySelector(`[data-index="${r}-${c}"]`);
            if (num > 0) {
                tile.innerHTML = `<span class="tile-contents color-${num}">${num}</span>`;
                tile.style.color = `rgba(${colors[num].r},${colors[num].g},${colors[num].b})`;
            }
            if (tile.classList.contains('unrevealed')) {
                tile.classList.toggle('unrevealed');
            }
            if (!tile.classList.contains('revealed')) {
                tile.classList.toggle('revealed');
            }
        },

        hideMinefield: function() {
            document.querySelector(DOMStrings.minesweeperBoard).style.visibility = 'hidden';
        },

        showMinefield: function() {
            document.querySelector(DOMStrings.minesweeperBoard).style.visibility = 'visible';
        }
    }
})();

// ------------ ***** ----------
// Controller for event listeners and main
// program logic
// ------------ ***** ----------
const Controller = (function(MineCtrl, UICtrl){
    // matrixes for checking tiles
    const checkFull = [
        [-1,-1], [-1, 0], [-1, 1],
        [0,-1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const game = {
        state: false
    }

    const checkAdjacent = [[-1,0], [0,-1], [0,1], [1,0]];
    
    const setEventListeners = function() {
        const DOM = UICtrl.getDomStrings();

        document.querySelector(DOM.minesweeperBoard)
            .addEventListener('click', playerClick);

        document.querySelector(DOM.start)
        .addEventListener('click', startNewGame);
        
        document.querySelector(DOM.size)
        .addEventListener('change', function(e){
            document.querySelector(DOM.sizeDisplay).
            textContent = document.querySelector(DOM.size).value;
        });

        document.querySelector(DOM.difficulty)
        .addEventListener('change', function(e){
            document.querySelector(DOM.diffDisplay).
            textContent = document.querySelector(DOM.difficulty).value;
        });
    }

    const startNewGame = function(e) {
        e.preventDefault();
        const DOM = UICtrl.getDomStrings();
        const gSize = document.querySelector(DOM.size).value;
        const gDiff = document.querySelector(DOM.difficulty).value;
        
        // -1. Set game state to on
        game.state = true;

        // 0. make minefield visible
        UICtrl.showMinefield();
        
        // 1. Set the size of the minefield to the
        // values chosen in the interface
        // in the MinefieldController
        // temporary code to set a grid size
        MineCtrl.setGridSize(gSize,gSize);

        // 2. Get the value of the minefield size
        const gameSize = MineCtrl.getGridSize();

        // 3. Set the mines in the minefield Controller
        MineCtrl.populateGrid(gDiff);

        // 4. Draw the minefield with the UIController
        UICtrl.drawGrid(gameSize.height, gameSize.width);

    }

    // process player click
    const playerClick = function(e) {
        
        // if target is not a tile, exit function
        if (!e.target.classList.contains('tile')
            || game.state === false) return;
        const tCoords = e.target.getAttribute('data-index');
        const arrCoords = tCoords.split('-');
        const eRow = Number(JSON.parse(JSON.stringify(arrCoords[0])));
        const eCol = Number(JSON.parse(JSON.stringify(arrCoords[1])));
        
        // begin a check of free tiles
        clickWave(eRow, eCol);
    }

    // check all adjacent tiles in a cascade
    // until no adjacent tiles that don't border
    // bombs are left
    const clickWave = function(r,c) {
        const originStatus = MineCtrl.checkTile(r,c);
        
        // if tile has bomb, reveal bomb and end game
        if (originStatus) {
            UICtrl.showBomb(r,c);
            gameOver();
            return;
        } else {
            // an array of tiles to check is iterated through
            // until no further free tiles are detected
            let tilesToCheck = [];
            tilesToCheck.push([[r,c]]);
            let allChecked = false;
            let checkMap = generateEmptyCheckMap();
            
            while (allChecked === false) {
                if (tilesToCheck.length > 0) {
                    
                    const thisCheck = tilesToCheck.slice(0,tilesToCheck.length);
                    
                    tilesToCheck.length = 0;
                    thisCheck.forEach(function(member, n){
                        
                        let rThis = member[0][0];
                        let cThis = member[0][1];
                        
                        let result = fullCheck(rThis,cThis);
                        checkMap[rThis - 1][cThis - 1] = true;
                        
                        UICtrl.revealTile(rThis, cThis, result);
                        // if no bombs are adjacent
                        if (result === 0) {
                            let checkList = checkFull.slice(0, checkFull.length);
                            checkList.forEach(function(member, n) {
                                // console.log(member);
                                cRow = member[0] + rThis;
                                cCol = member[1] + cThis;
                                // console.log('cCoord: ', cRow, cCol);
                                const size = MineCtrl.getGridSize();
                                // if coordinate is out of bounds, skip
                                if (cRow < 1 || cRow > size.height ||
                                    cCol < 1 || cCol > size.width) {
                                        return;
                                    }
                                // console.log(checkMap[cRow - 1][cCol -1]);
                                // if tile hasn't been checked, add it to list
                                // to be checked
                                if (!checkMap[cRow -1][cCol -1]) {
                                    tilesToCheck.push([[cRow,cCol]]);
                                }
                                
                            
                            });

                        }
                    });
                } else {
                    allChecked = true;
                }
            }
        }
    }

    // checks all 8 tiles around a tile
    const fullCheck = function(r, c) {
        let checkList = checkFull.slice(0, checkFull.length);
        let bombsFound = 0;
        checkList.forEach(function(member, n){
            let rThis = member[0] + (r);
            let cThis = member[1] + (c);
            const size = MineCtrl.getGridSize();
            // if the tile is inbounds, check it for a mine
            if (rThis > 1 && cThis > 1 && rThis <= size.height && cThis <= size.width) {
                let res = MineCtrl.checkTile(rThis, cThis);
                if (res) {
                    bombsFound++;
                } 
            }
        });
        return bombsFound;
    }

    const generateEmptyCheckMap = function() {
        let emptyMap = [];
        let size = MineCtrl.getGridSize();
        for (let eRow = 0; eRow < size.height; eRow++) {
            let emptyRow = [];
            for (let eCol = 0; eCol < size.width; eCol++) {
                emptyRow.push(false);
            }
            emptyMap.push(emptyRow);
        }
        
        return emptyMap;
    }

    const gameOver = function(){
        game.state = false;
    }

    
    
    
    return {
        init: function() {
            // 1. Establish event listeners
            setEventListeners();

            // 2. Start a new game
            // startNewGame();
        }
    }
})(MinefieldController, UIController);

Controller.init();