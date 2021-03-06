(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var TileView = Minesweeper.TileView = function(options) {
    this.$el = options.$el;
    this.tile = options.tile;
    this.boardView = options.boardView;
    
    this.$el.on("mousedown", this.onTileClicked.bind(this));
  }
  
  TileView.clickLog = [];
  
  TileView.resetClickLog = function() {
    TileView.clickLog = [];
  };
  
  TileView.logClick = function(event) {
    TileView.clickLog.push({
      button: event.button,
      time: event.timeStamp
    })
  };
  
  TileView.checkForTwoButtonClick = function() {
    if (TileView.clickLog.length < 2) {
      return false;
    }
    
    var lastTwoClicks = _.last(TileView.clickLog, 2);
    var timeDiff = Math.abs(lastTwoClicks[1].time - lastTwoClicks[0].time);
    if (lastTwoClicks[0].button !== lastTwoClicks[1].button && timeDiff < 50) {
      return true;
    }
    
    return false
  };
  
  TileView.prototype.onTileClicked = function(event) {
    var that = this;
    TileView.logClick(event);
    
    setTimeout(function() {
      if (that.boardView.gameView.game.isStarted) {
        if (TileView.checkForTwoButtonClick()) {
          that.boardView.updateTiles(that.revealNum());
        } else if (event.button === 0) {
          that.boardView.updateTiles(that.revealTile());
        } else if (event.button === 2) {
          that.toggleFlag();
          that.boardView.updateLocationsLeftToFlag();
        }
      
        that.boardView.gameView.checkForGameEnd();
      }
    }, 50)
  };
  
  TileView.prototype.revealTile = function() {
    return this.boardView.board.revealTiles(this.$el.data('location'));
  };
  
  TileView.prototype.revealNum = function() {
    return this.boardView.board.revealNum(this.$el.data('location'));
  };
  
  TileView.prototype.updateTile = function() {
    if (this.tile.isRevealed) {
      if (this.tile.isBomb) {
        this.$el.addClass("_B" + " revealed");
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