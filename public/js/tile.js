(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Tile = Minesweeper.Tile = function() {
    this.isBomb = false;
    this.isFlagged = false;
    this.isRevealed = false;
    
    this.adjacentBombCount = 0;
  };
  
  Tile.prototype.setBomb = function() {
    this.isBomb = true;
  };
  
  Tile.prototype.toggleFlag = function() {
    if (this.isFlagged) {
      this.isFlagged = false;
    } else {
      if (!this.isRevealed) {
        this.isFlagged = true;
      };
    };
  };
  
  Tile.prototype.reveal = function() {
    if (!this.isFlagged) {
      this.isRevealed = true;
      return true;
    };
    return false;
  };
  
  Tile.prototype.incrementBombCount = function() {
    this.adjacentBombCount += 1;
  };
})(this);