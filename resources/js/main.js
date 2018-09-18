const MinefieldController = (function(){
    
    // gridSize variable stores size of grid for game
    let gridSize = {
        height: 3,
        width: 3
    }

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
        }
    }
})();

const UIController = (function(){
    return {
        
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
        MineCtrl.setGridSize(3,3);

        // 2. Get the value of the minefield size
        const gameSize = MineCtrl.getGridSize();

        // 3. Draw the minefield with the UIController
    }
    
    return {
        init: function() {
            // 1. Establish event listeners
            setEventListeners();

            // 2. Start a new game
        }
    }
})(MinefieldController, UIController);

Controller.init();