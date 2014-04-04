(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var TileView = Minesweeper.TileView = function(options) {
    this.$el = options.$el;
    this.tile = options.tile;
    this.boardView = options.boardView;
    
    this.$el.on("mouseup", this.onTileClicked.bind(this));
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
    if (lastTwoClicks[0].button !== lastTwoClicks[1].button && timeDiff < 100) {
      return true;
    }
    
    return false
  };
  
  // TileView.getClickType = function() {
//     setTimeout(function() {
//       
//     }, 100);
//   }
  
  TileView.prototype.onTileClicked = function(event) {
    if (this.boardView.gameView.game.isStarted) {
      TileView.logClick(event);
      console.log(Minesweeper.TileView.checkForTwoButtonClick());
      if (Minesweeper.TileView.checkForTwoButtonClick()) {
        console.log("TWO BUTTON CLICK REGISTERED");
        this.boardView.updateTiles(this.revealNum());
      } else if (event.button === 0) {
        console.log("LEFT CLICK REGISTERED");
        this.boardView.updateTiles(this.revealTile());
      } else if (event.button === 2) {
        console.log("RIGHT CLICK REGISTERED");
        this.toggleFlag();
        this.boardView.updateLocationsLeftToFlag();
      }
      
      this.boardView.gameView.checkForGameEnd();
    }
  };
  
  TileView.prototype.revealTile = function() {
    return this.boardView.board.revealTile(this.$el.data('location'));
  };
  
  TileView.prototype.revealNum = function() {
    return this.boardView.board.revealNum(this.$el.data('location'));
  };
  
  TileView.prototype.updateTile = function() {
    if (this.tile.isRevealed) {
      if (this.tile.isBomb) {
        this.$el.addClass("_B");
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