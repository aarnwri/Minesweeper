(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var Board = Minesweeper.Board = function(sizeX, sizeY, numBombs) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.numBombs = numBombs;
    
    this.tiles = {};
    
    this.bombLocations = [];
    this.bombRevealed = false;
    this.locationsLeftToFlag = numBombs;
    
    this.tilesToReveal = [];
    this.revealedTiles = [];
    
    this.generateBoard();
    this.setBombs();
    this.updateBombLocations();
    this.updateAdjacentBombCounts();
    this.updateInitialTilesToReveal();
  };
  
  Board.prototype.generateBoard = function() {
    for (var i = 0; i < this.sizeY; i++) {
      for (var j = 0; j < this.sizeX; j++) {
        this.tiles[(j + "," + i)] = new Minesweeper.Tile();
      }
    }
  };
  
  Board.prototype.setBombs = function() {
    var availableTiles = _.keys(this.tiles);
    
    for (var i = 0; i < this.numBombs; i++) {
      var bombLocation = _.sample(availableTiles);
      this.tiles[bombLocation].setBomb();

      var bombIdx = _.indexOf(availableTiles, bombLocation);
      availableTiles.splice(bombIdx, 1);
    }
  };
  
  Board.prototype.updateBombLocations = function() {
    var that = this;
    
    this.bombLocations = [];
    _.each(this.tiles, function(tile, location) {
      if (tile.isBomb) {
        that.bombLocations.push(location);
      }
    });
  };
  
  Board.prototype.updateAdjacentBombCounts = function() {
    var that = this;
    
    _.each(this.bombLocations, function(location) {
      _.each(that.adjacentLocations(location), function(adjLocation) {
        that.tiles[adjLocation].incrementBombCount();
      });
    });
  };
  
  Board.prototype.updateInitialTilesToReveal = function() {
    var that = this;
    
    _.each(this.tiles, function(tile, location) {
      if (!tile.isBomb) {
        that.tilesToReveal.push(location);
      }
    });
  };
  
  Board.prototype.updateLocationsLeftToFlag = function() {
    this.locationsLeftToFlag = this.numBombs - Minesweeper.Tile.numFlaggedTiles;
    if (this.locationsLeftToFlag < 0) {
      this.locationsLeftToFlag = 0;
    }
    return this.locationsLeftToFlag;
  };
  
  Board.prototype.onBoard = function(location) {
    return (this.tiles.hasOwnProperty(location));
  };
  
  Board.prototype.adjacentLocations = function(location) {
    var that = this;
    
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
    if(this.tiles[location].reveal()) {
      this.revealedTiles.push(location);
      
      if (this.tiles[location].isBomb) {
        this.bombRevealed = true;
        this.revealBombs();
      } else if (this.tiles[location].adjacentBombCount === 0 && 
                (!this.tiles[location].isFlagged)) {
        _.each(this.adjacentLocations(location), function(adjLocation) {
          if (!that.tiles[adjLocation].isRevealed) {
            that.revealTiles(adjLocation);
          }
        });
      }
    }
  };
  
  Board.prototype.revealBombs = function() {
    var that = this;
    
    _.each(this.bombLocations, function(location) {
      that.tiles[location].reveal();
    });
  };
  
  Board.prototype.toggleFlag = function(location) {
    this.tiles[location].toggleFlag();
  };
  
  Board.prototype.parseLocationString = function(location) {
    return _.map(location.split(","), function(value) {
      return parseInt(value);
    });
  };
  
})(this);