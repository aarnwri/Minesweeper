(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Game = Minesweeper.Game = function(difficulty) {
    
    var boardSizeX = difficulty[0];
    var boardSizeY = difficulty[1];
    var numBombs = difficulty[2];
    
    this.board = new Minesweeper.Board(boardSizeX, boardSizeY, numBombs);
    
    this.isStarted = false;
  };
  
  Game.prototype.isWon = function() {
    return (_.isEqual(this.board.tilesToReveal, this.board.revealedTiles));
  };
  
  Game.prototype.start = function() {
    this.isStarted = true;
  }
  
  Game.prototype.end = function() {
    this.isStarted = false;
  }
  
})(this);