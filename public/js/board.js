(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(sizeX, sizeY, numBombs) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.numBombs = numBombs;
    
    this.tiles = {};
    
    this.bombLocations = [];
    this.flaggedLocations = [];
    
    this.tilesToReveal = [];
    this.revealedTiles = [];
    
    
    this.generateBoard();
    this.setBombs();
    this.updateBombLocations();
    this.updateAdjacentBombCounts();
    this.updateTilesToReveal();
  };
  
  Board.prototype.generateBoard = function() {
    for (var i = 0; i < this.sizeY; i++) {
      for (var j = 0; j < this.sizeX; j++) {
        this.tiles[(j + "," + i)] = new Minesweeper.Tile();
      };
    };
  };
  
  Board.prototype.setBombs = function() {
    var availableTiles = _.keys(this.tiles);
    var bombLocation = _.sample(availableTiles)
    
    for (var i = 0; i < this.numBombs; i++) {
      this.tiles[bombLocation].setBomb();

      var bombIdx = _.indexOf(availableTiles, bombLocation);
      availableTiles.splice(bombIdx, 1);
    };
  };
  
  Board.prototype.updateBombLocations = function() {
    var that = this;
    
    this.bombLocations = [];
    _.each(this.tiles, function(tile, location) {
      if (tile.isBomb()) {
        that.bombLocations.push(location);
      };
    });
  };
  
  Board.prototype.updateAdjacentBombCounts = function() {
    var that = this;
    
    _.each(this.bombLocations, function(location) {
      _.each(that.adjacentTiles(location), function(adjLocation) {
        that.tiles[adjLocation].incrementBombCount();
      });
    });
  };
  
  Board.prototype.updateTilesToReveal = function() {
    var that = this;
    
    _.each(this.tiles, function(tile, location) {
      if (!tile.isBomb) {
        that.tilesToReveal.push(location);
      }
    });
  };
  
  Board.prototype.onBoard = function(location) {
    return (this.tiles.hasOwnProperty(location));
  };
  
  Board.prototype.adjacentTiles = function(location) {
    var that = this
    
    var pos = this.parseLocationString(location);
    
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
    
    var newLocations = _.map(newPositions, function(newPos) {
      return newPos.join();
    });
    return _.filter(newLocations, function(newLocation) {
      return that.onBoard(newLocation);
    });
  };
  
  Board.prototype.revealTiles = function(location) {
    var that = this;
    
    this.tiles[location].reveal();
    this.revealedTiles.push(location);
    
    if (this.tiles[location].adjacentBombCount === 0 && 
        !this.tiles[location].isRevealed) {
      _.each(this.adjacentTiles(location), function(adjLocation) {
        that.revealTiles(adjLocation);
      });
    };
  };
  
  Board.prototype.flagLocation = function(location) {
    this.tiles[location].setFlag();
    this.flaggedLocations.push(location);
  };
  
  Board.prototype.unFlagLocation = function(location) {
    this.tiles[location].removeFlag();
    
    var flagIdx = _.indexOf(flaggedLocations, location);
    flaggedLocations.splice(flagIdx, 1);
  }
  
  Board.prototype.parseLocationString = function(location) {
    return _.map(location.split(","), function(value) {
      return parseInt(value);
    });
  };
  
})(this);