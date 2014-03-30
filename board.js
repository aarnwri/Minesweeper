(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(sizeX, sizeY, numBombs) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.numBombs = numBombs;
    
    this.tiles = {};
    this.tilesToReveal = {};
    this.revealedTiles = {};
    
    this.bombLocations = {};
    this.flaggedLocations = {};
    
    this.generateBoard();
    this.setBombs();
    this.updateTiles();
  };
  
  Board.prototype.generateBoard = function() {
    for (var i = 0; i < this.sizeY; i++) {
      for (var j = 0; j < this.sizeX; j++) {
        this.tiles[(j + "," + i)] = 0;
        this.tilesToReveal[(j + "," + i)] = true;
      };
    };
  };
  
  Board.prototype.setBombs = function() {
    var availableTiles = _.keys(this.tiles);

    for (var i = 0; i < this.numBombs; i++) {
      var bombLocation = _.sample(availableTiles);
      this.bombLocations[bombLocation] = true;
      this.tiles[bombLocation] = "B";
      delete this.tilesToReveal[bombLocation];
      
      var bombIdx = _.indexOf(availableTiles, bombLocation);
      availableTiles.splice(bombIdx, 1);
    };
  };
  
  Board.prototype.updateTiles = function() {
    var that = this;
    
    _.each(this.bombLocations, function(value, posString) {
      var adjacentTiles = that.adjacentTiles(posString);
      _.each(that.adjacentTiles(posString), function(adjPosString) {
        if (!that.bombLocations[adjPosString]) {
          that.tiles[adjPosString] += 1;
        };
      });
    });
  };
  
  Board.prototype.onBoard = function(posString) {
    if (this.tiles.hasOwnProperty(posString)) {
      return true;
    } else {
      return false;
    };
  };
  
  Board.prototype.adjacentTiles = function(posString) {
    var that = this
    
    var pos = this.parsePosString(posString);
    
    var x = pos[0], y = pos[1];
    var newPositions = [
      [x - 1, y + 1],
      [x    , y + 1],
      [x + 1, y + 1],
      [x + 1, y    ],
      [x + 1, y - 1],
      [x    , y - 1],
      [x - 1, y - 1],
      [x - 1, y    ]
    ]
    
    var newPosStrings = _.map(newPositions, function(newPos) {
      return newPos.join();
    });
    
    return _.filter(newPosStrings, function(newPosString) {
      return that.onBoard(newPosString);
    });
  };
  
  Board.prototype.parsePosString = function(posString) {
    return _.map(posString.split(","), function(value) {
      return parseInt(value);
    });
  };
  
})(this);