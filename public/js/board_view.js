(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var BoardView = Minesweeper.BoardView = function(options) {
    this.$el = options['$el'];
    this.board = options['board'];
    
    this.generateBoard(options['difficulty'])
  };
  
  BoardView.prototype.generateBoard = function(difficulty) {
    
    
    var $boardEl = $("#board");
    
    //TODO: change this to use jquery data elements
  
    var buildRows = function() {
      var rows = "";
      for (var i = 0; i < that.game.board.sizeY; i++) {
        rows += "<div class=\"row\">";
        for (var j = 0; j < that.game.board.sizeX; j++) {
          rows += "<div class=\"tile\" data-x=\"" + j + "\" data-y=\"" + i + "\"></div>"
        };
        rows += "</div>";
      };
      return rows;
    };
  
    $boardEl.html(buildRows());
  };
  
})(this);