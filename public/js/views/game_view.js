(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var GameView = Minesweeper.GameView = function(options) {
    this.game = options['game'];
    this.setupGameData();
    
    this.boardView = new Minesweeper.BoardView({
      $el: $("#board"),
      board: this.game.board,
      gameView: this
    })
    
    $("input[name='difficulty']").change(this.changeBoardDifficulty.bind(this));
    $(".start-button").on("click", this.startGame.bind(this));
  };
  
  GameView.prototype.changeBoardDifficulty = function() {
    if (!this.game.isStarted) {
      var difficulty = $('input[name=difficulty]:checked').val();
      
      this.game = new Minesweeper.Game({
        difficulty: difficulty
      });
      this.boardView.resetBoard(difficulty);
    }
  };
  
  GameView.prototype.startGame = function() {
    this.game.end();
    this.changeBoardDifficulty();
    $("#winning-message").empty();
    this.setupGameData();
    this.setupTimer();
    this.game.start();
  };
  
  GameView.prototype.setupGameData = function() {
    var $locationsLeftToFlag = $('<span class="locations-left-to-flag">Bombs Left: ' + 
                                  this.game.board.numBombs +'</span>');
    var $gameTime = $('<span class="game-time">Time: ' + this.game.time + '</span>');
    $("#game-data").html($locationsLeftToFlag);
    $("#game-data").append($gameTime);
  };
  
  GameView.prototype.setupTimer = function() {
    var that = this;
    
    this.game.resetTimer();
    GameTime = setInterval(function() {
      that.game.incrementTimer();
      $(".game-time").html('Time: ' + that.game.time);
    }, 1000);
  };
  
  GameView.prototype.endGame = function() {
    clearInterval(GameTime);
    this.game.end();
  };
  
  GameView.prototype.checkForWin = function() {
    if (this.game.checkForWin()) {
      this.endGame();
      this.messageWinner();
    }
  };
  
  GameView.prototype.checkForLoss = function() {
    if (this.game.checkForLoss()) {
      this.endGame();
    }
  };
  
  GameView.prototype.messageWinner = function() {
    $("#winning-message").html("<h1>Congrats!!! You WIN!!!</h1>");
  };
  
})(this);

// * Tile.prototype.reveal could be rewritten as Tile.prototype.reveal = function() {return (this.isRevealed = !this.isFlagged);}
// * options['difficulty'] is equivalent to options.difficulty
// * in Board.prototype.setBombs I would use the version of sample that takes a number as well and then loop over the chosen locations and loot up their tiles and set them as bombs
// * you could probably also combine Board.prototype.updateBombLocations into Board.prototype.setBombs since the sample function basically gives you back the results of Board.prototype.updateBombLocations
// * I like Board.prototype.updateAdjacentBombCounts
// * Board.prototype.updateInitialTilesToReveal could be rewritten as function() {that.tilesToReveal = _.reject(this.tiles, function(tile) {tile.isBomb))}
// * once the game starts I suggest disabling the difficulty raido buttons and re-enable then when it is over
// * maybe combine GameView.prototype.checkForWin and GameView.prototype.checkForLoss
// * see if you can make BoardView.prototype.updateTiles only update the TileViews for Tiles that actually changed?