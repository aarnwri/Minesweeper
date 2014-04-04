(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var TileView = Minesweeper.TileView = function(options) {
    this.$el = options.$el;
    this.tile = options.tile;
    this.boardView = options.boardView;
    
    this.$el.on("mouseup", this.onTileClicked.bind(this));
  }
  
  TileView.prototype.onTileClicked = function() {
    if (this.boardView.gameView.game.isStarted) {
      if (event.button === 0) {
        this.boardView.updateTiles(this.revealTile());
      } else if (event.button === 2) {
        this.toggleFlag();
        this.boardView.updateLocationsLeftToFlag();
      }
      
      this.boardView.gameView.checkForGameEnd();
    }
  };
  
  TileView.prototype.revealTile = function() {
    return this.boardView.board.revealTiles(this.$el.data('location'));
  };
  
  TileView.prototype.updateTile = function() {
    if (this.tile.isRevealed) {
      if (this.tile.isBomb) {
        this.$el.addClass("_B");
      } else {
        this.$el.addClass("_" + this.tile.adjacentBombCount.toString() + " revealed");
      }
    } else if (this.tile.isFlagged) {
      this.$el.addClass("_F");
    } else {
      this.$el.removeClass("_F");
    }
  };

  TileView.prototype.toggleFlag = function() {
    this.tile.toggleFlag();
    this.updateTile();
  };
})(this);