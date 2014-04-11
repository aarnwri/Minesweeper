(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var GameView = Minesweeper.GameView = function(options) {
    this.game = options.game;
    this.setupGameData();
    
    this.hasBeenPlayed = false;
    this.boardView = new Minesweeper.BoardView({
      $el: $("#board"),
      board: this.game.board,
      gameView: this
    })
    
    $("input[name='difficulty']").change(this.resetGameBoard.bind(this));
    $(".start-button").on("click", this.startGame.bind(this));
  };
  
  GameView.prototype.resetGameBoard = function() {
    var difficulty = $('input[name=difficulty]:checked').val();
    
    this.game = new Minesweeper.Game({
      difficulty: difficulty
    });
    this.boardView.resetBoard(difficulty);
  };
  
  GameView.prototype.toggleDifficultyButtonsEnabled = function() {
    $('input[name=difficulty]').attr('disabled', this.game.isStarted);
  };
  
  GameView.prototype.startGame = function() {
    if (this.hasBeenPlayed) {
      this.endGame();
      this.resetGameBoard();      
      $("#winning-message").empty();
    }
    Minesweeper.TileView.resetClickLog();
    this.setupGameData();
    this.setupTimer();
    this.game.start();
    this.hasBeenPlayed = true;
    this.toggleDifficultyButtonsEnabled();
  };
  
  GameView.prototype.setupGameData = function() {
    $("span.locations-left-to-flag > var").html(this.game.board.numBombs);
    $(".game-time > var").html(this.game.time);
  };
  
  GameView.prototype.setupTimer = function() {
    var that = this;
    
    this.game.resetTimer();
    GameTime = setInterval(function() {
      that.game.incrementTimer();
      $(".game-time > var").html(that.game.time);
    }, 1000);
  };
  
  GameView.prototype.endGame = function() {
    clearInterval(GameTime);
    this.game.end();
    this.messageWinner();
    this.toggleDifficultyButtonsEnabled();
  };
  
  GameView.prototype.checkForGameEnd = function() {
    var that = this;
    
    if (this.game.checkForLoss()) {
      setTimeout(function() {
        that.boardView.revealBombs();
      }, 500);
    }
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