(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var DifficultyLevels = Minesweeper.DifficultyLevels = {
    'beginner': [8, 8, 10],
    'intermediate': [16, 16, 40],
    'expert': [100, 50, 99]
  };
  
  var Game = Minesweeper.Game = function(options) {
    this.difficulty = options.difficulty;
    
    var boardSizeX = Minesweeper.DifficultyLevels[this.difficulty][0];
    var boardSizeY = Minesweeper.DifficultyLevels[this.difficulty][1];
    var numBombs = Minesweeper.DifficultyLevels[this.difficulty][2];
    
    this.board = new Minesweeper.Board(boardSizeX, boardSizeY, numBombs);
    Minesweeper.Tile.resetNumFlaggedTiles();
    
    this.isStarted = false;
    this.time = 0;
    this.isWon = false;
    this.isLost = false;
  };
  
  Game.prototype.checkForWin = function() {
    return (this.isWon = ($(this.board.tilesToReveal).not(this.board.revealedTiles).length === 0 &&
                          $(this.board.revealedTiles).not(this.board.tilesToReveal).length === 0));
  };
  
  Game.prototype.checkForLoss = function() {
    return (this.isLost = this.board.bombRevealed);
  };
  
  Game.prototype.start = function() {
    this.isStarted = true;
  };
  
  Game.prototype.incrementTimer = function() {
    this.time += 1;
  };
  
  Game.prototype.resetTimer = function() {
    this.time = 0;
  }
  
  Game.prototype.end = function() {
    this.isStarted = false;
  };
  
})(this);