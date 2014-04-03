(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var GameView = Minesweeper.GameView = function(options) {
    this.game = options['game'];
    
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
    };
  };
  
  GameView.prototype.startGame = function() {
    this.game.end();
    this.changeBoardDifficulty();
    $("#winning-message").empty();
    this.game.start();
  };
  
  GameView.prototype.endGame = function() {
    this.game.end();
  };
  
  GameView.prototype.checkForWin = function() {
    if (this.game.checkForWin()) {
      this.game.end();
      this.messageWinner();
    };
  };
  
  GameView.prototype.checkForLoss = function() {
    if (this.game.checkForLoss()) {
      this.game.end();
    }
  };
  
  GameView.prototype.messageWinner = function() {
    $("#winning-message").html("<h1>Congrats!!! You WIN!!!</h1>");
  };
})(this);