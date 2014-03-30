(function(root) {
  
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var UI = Minesweeper.UI = function(game) {
    this.game = game;
    this.board = game.board;
    
    this.generateBoard();
  };
  
  UI.prototype.changeBoardDifficulty = function() {
    if (this.game.started) {
      
    } else {
      this.generateBoard();
    };
  };
  
  UI.prototype.generateBoard = function() {
    var that = this;
    
    var difficulties = {
      'beginner': [8, 8, 10],
      'intermediate': [16, 16, 40],
      'expert': [30, 16, 99]
    };
    
    //find the difficulty checked and build a new board of that size
    var difficulty = $('input[name=difficulty]:checked').val();
    
    this.game = new Minesweeper.Game(difficulties[difficulty]);
    this.board = this.game.board;
    
    var $boardEl = $("#board");
  
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
  
  UI.prototype.startGame = function() {
    this.game.end();
    this.changeBoardDifficulty();
    $("#winning-message").empty();
    this.game.start();
    
    // start timer;
  };
  
	UI.prototype.bindMouseClicks = function() {
    // on click radio button... generate board
    $("input[name='difficulty']").change(this.changeBoardDifficulty.bind(this));
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
      }
      console.log("event.button", event.button);
      // this.revealTile($tile);
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

