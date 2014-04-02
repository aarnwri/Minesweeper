(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var BoardView = Minesweeper.BoardView = function(options) {
    this.$el = options['$el'];
    this.board = options['board'];
    
    this.tileViews = [];
    
    this.generateBoard(options['difficulty']);
  };
  
  BoardView.prototype.generateBoard = function(difficulty) {
    console.log("generateBoard called");
    console.log(difficulty);
    var sizeX = difficulty[0];
    var sizeY = difficulty[1];
    
    this.$el.html();
    console.log(this.$el);
   
    for (var i = 0; i < sizeY; i++) {
      var row = $('<div class="row"></div>');
      for (var j = 0; j < sizeX; j++) {
        var tile = $('<div class="tile"></div>');
        var tileLocation = j.toString() + "," + i.toString();
        tile.data({location: tileLocation});
        this.tileViews.push(new Minesweeper.TileView({
          $el: tile, 
          tile: this.board.tiles[tileLocation]
        }));
        row.append(tile);
      };
      this.$el.append(row);
    };
  };
  
})(this);