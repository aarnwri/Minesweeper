(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Game = Minesweeper.Game = function(difficulty) {
    
    var boardSizeX = difficulty[0];
    var boardSizeY = difficulty[1];
    var numBombs = difficulty[2];
    
    this.board = new Minesweeper.Board(boardSizeX, boardSizeY, numBombs);
    
    this.started = false;
  };
  
  Game.prototype.isWon = function() {
    if (_.isEqual(this.board.tilesToReveal, this.board.revealedTiles)) {
      return true;
    } else {
      return false;
    };
  };
  
  Game.prototype.start = function() {
    this.started = true;
  }
  
  Game.prototype.end = function() {
    this.started = false;
  }
  
})(this);