(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var BoardView = Minesweeper.BoardView = function(options) {
    this.$el = options.$el;
    this.board = options.board;
    this.gameView = options.gameView;
    
    this.tileViews = [];
    
    this.generateBoard("beginner");
  };
  
  BoardView.prototype.generateBoard = function(difficulty) {
    var sizeX = Minesweeper.DifficultyLevels[difficulty][0];
    var sizeY = Minesweeper.DifficultyLevels[difficulty][1];
    
    this.$el.empty();
    this.tileViews = [];
   
    for (var i = 0; i < sizeY; i++) {
      var $row = $('<div class="row"></div>');
      for (var j = 0; j < sizeX; j++) {
        var $tile = $('<div class="tile"></div>');
        var tileLocation = j.toString() + "," + i.toString();
        $tile.data({location: tileLocation});
        this.tileViews.push(new Minesweeper.TileView({
          $el: $tile, 
          tile: this.board.tiles[tileLocation],
          boardView: this
        }));
        $row.append($tile);
      }
      this.$el.append($row);
    }
  };
  
  BoardView.prototype.resetBoard = function(difficulty) {
    this.board = this.gameView.game.board;
    this.generateBoard(difficulty);
    this.updateLocationsLeftToFlag();
  }
  
  BoardView.prototype.updateTiles = function() {
    _.each(this.tileViews, function(view) {
      view.updateTile();
    });
  };
  
  BoardView.prototype.updateLocationsLeftToFlag = function() {
    var numLocations = this.board.updateLocationsLeftToFlag();
    $(".locations-left-to-flag").html('Bombs Left: ' + numLocations);
  }
  
  BoardView.prototype.revealBombs = function() {
    this.board.revealBombs();
    this.updateTiles();
    this.GameView.endGame();
  };
  
})(this);