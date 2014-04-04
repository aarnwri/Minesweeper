(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var GameView = Minesweeper.GameView = function(options) {
    this.game = options.game;
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
    this.messageWinner();
  };
  
  GameView.prototype.checkForGameEnd = function() {
    console.log("checkfge called");
    if (this.game.checkForWin() || this.game.checkForLoss()) {
      this.endGame();
    }
  };
  
  GameView.prototype.messageWinner = function() {
    if (this.game.isWon) {
      $("#winning-message").html("<h1>Congrats!!! You WIN!!!</h1>");  
    }
  };
  
})(this);