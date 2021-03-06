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
    this.updateAdjacentBombCounts();
    this.updateInitialTilesToReveal();
  };
  
  Board.prototype.generateBoard = function() {
    for (var i = 0; i < this.sizeY; i++) {
      for (var j = 0; j < this.sizeX; j++) {
        var location = (j + "," + i);
        this.tiles[location] = new Minesweeper.Tile(location);
      }
    }
  };
  
  Board.prototype.setBombs = function() {
    var that = this;
    var availableTiles = _.keys(this.tiles);
    
    this.bombLocations = _.sample(availableTiles, this.numBombs);
    _.each(this.bombLocations, function(location) {
      that.tiles[location].setBomb();
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
    
    this.tilesToReveal = _.reject(_.keys(this.tiles), function(location) {
      return that.tiles[location].isBomb;
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
  
  Board.prototype.nonRevealedAdjacentLocations = function(location) {
    var that = this;
    var adjacentLocations = this.adjacentLocations(location);
    
    return _.filter(adjacentLocations, function(adjLocation) {
      return (!that.tiles[adjLocation].isRevealed);
    });
  };
  
  Board.prototype.revealTile = function(location) {
    if (this.tiles[location].reveal()) {
      this.revealedTiles.push(location);
      if (this.tiles[location].isBomb) {
        this.bombRevealed = true;
      }
      return true;
    }
    return false;
  };
  
  Board.prototype.revealNum = function(location) {
    var that = this;
    var revealedLocations = [];
    
    if (this.tiles[location].isRevealed) {
      var adjacentFlagCount = (_.filter(this.adjacentLocations(location), function(loc) {
        return that.tiles[loc].isFlagged;
      })).length;
            
      if (adjacentFlagCount >= this.tiles[location].adjacentBombCount) {
        revealedLocations = _.union(revealedLocations, this.revealAdjacentTiles(location));
      }
    }
    return revealedLocations;
  };
  
  Board.prototype.revealTiles = function(location) {
    var that = this;
    var revealedLocations = [];
    
    if (this.revealTile(location)) {
      revealedLocations.push(location);
      if (!this.tiles[location].isBomb && this.tiles[location].adjacentBombCount === 0) {
        revealedLocations = _.union(revealedLocations, this.revealAdjacentTiles(location));
      }
    }
    
    return revealedLocations;
  };
  
  Board.prototype.revealAdjacentTiles = function(location) {
    var that = this;
    
    var revealedLocations = [];
    var tilesToReveal = that.adjacentLocations(location);
    
    var tilesAddedToTilesToReveal = {};
    _.each(tilesToReveal, function(tile) {
      tilesAddedToTilesToReveal[tile] = true;
    });
    
    while (tilesToReveal.length > 0) {
      var loc = tilesToReveal.pop();
      if (this.revealTile(loc)) {
        revealedLocations.push(loc);
        if (this.tiles[loc].adjacentBombCount === 0) {
          _.each(this.nonRevealedAdjacentLocations(loc), function(nonRevealedLoc) {
            if (!tilesAddedToTilesToReveal[nonRevealedLoc]) {
              tilesToReveal.push(nonRevealedLoc);
            }
          });
        }
      }
    }
    
    return revealedLocations;
  };
  
  Board.prototype.revealBombs = function() {
    var that = this;
    
    _.each(this.bombLocations, function(location) {
      that.tiles[location].reveal();
    });
    return this.bombLocations;
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