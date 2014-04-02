(function(root) {
  
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var UI = Minesweeper.UI = function() {
    
    this.bindMouseClicks();
  };
  
  
  
  
  
  UI.prototype.startGame = function() {
    this.game.end();
    this.changeBoardDifficulty();
    $("#winning-message").empty();
    this.game.start();
    
    // start timer;
  };
  
	UI.prototype.bindMouseClicks = function() {
    // $("input[name='difficulty']").change(this.changeBoardDifficulty.bind(this));
    $(".start-button").on("click", this.startGame.bind(this));
    $("#board").on("mouseup", ".tile", this.onTileClicked.bind(this));
  };

  UI.prototype.onTileClicked = function(event) {
    if (this.game.started) {
      var $tile = $(event.currentTarget);
      if (event.button === 0) {
        this.revealTile($tile);
      } else if (event.button === 2) {
        this.flagTile($tile);
      };
      // else if button = 0 && 2 do cool stuff...
      if (this.game.isWon()) {
        this.game.end();
        // stop timer
        // end game
        // display message
        $("#winning-message").html("<h1>Congrats!!! You WIN!!!</h1>");
      }
    };
    
    // check for winning condition here?
  };
  
  UI.prototype.flagTile = function($tile) {
    var pos = $tile.data("x") + "," + $tile.data("y");
    
    if (!this.board.revealedTiles[pos]) {
      $tile.toggleClass("_F");
    }
  };
  
  UI.prototype.revealTile = function($tile) {
    var that = this;
    
    if ($tile.hasClass("_F")) {
      return;
    }
    
    var pos = $tile.data("x") + "," + $tile.data("y");
    var tileValue = this.board.tiles[pos];
    
    if (tileValue === "B") {
      // reveal all bombs
      this.revealBombs();
      // kill the game
      this.game.end();
      // stop the timer
      return;
    }
    
    this.board.revealedTiles[pos] = true;
    
    $tile.addClass("_" + tileValue.toString() + " revealed");
    if (tileValue === 0) {
      _.each(this.board.adjacentTiles(pos), function(adjPos) {
        if (!that.board.revealedTiles[adjPos]) {
          var adjPosArr = adjPos.split(",");
          var x = adjPosArr[0];
          var y = adjPosArr[1];
          var $adjTile = $('[data-x="' + x + '"][data-y="' + y + '"]');
                                         
          that.revealTile($adjTile);
        };
      });
    }; 
  };
  
  UI.prototype.revealBombs = function() {
    var that = this;
    // get all bomb locations
    // each bomb location find the element in the dom and trigger a click event on it.
    var bombLocations = _.keys(this.board.bombLocations);
    
    _.each(bombLocations, function(bombLocation) {
      var bombLocationArr = bombLocation.split(",");
      var x = bombLocationArr[0];
      var y = bombLocationArr[1];
      
      var $bombTile = $('[data-x="' + x + '"][data-y="' + y + '"]');
      
      $bombTile.addClass("_B");
    });
  };
  
})(this);

