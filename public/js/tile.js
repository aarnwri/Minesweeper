(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Tile = Minesweeper.Tile = function() {
    this.isBomb = false;
    this.isFlagged = false;
    this.isFlagable = false;
    this.isRevealed = false;
    
    this.adjacentBombCount = 0;
  };
  
  Tile.prototype.setBomb = function() {
    this.isBomb = true;
    this.isFlagable = true;
  };
  
  Tile.prototype.setFlag = function() {
    if (this.isFlagable) {
      this.isFlagged = true;      
    };
  };
  
  Tile.prototype.removeFlag = function() {
    this.isFlagged = false;
  };
  
  Tile.prototype.reveal = function() {
    this.isRevealed = true;
  };
  
  Tile.prototype.incrementBombCount = function() {
    this.adjacentBombCount += 1;
  };
})(this);