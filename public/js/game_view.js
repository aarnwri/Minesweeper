(function(root) {
  var Minesweeper = root.Minesweeper = (root.Minesweeper || {});
  
  var GameView = Minesweeper.GameView = function(options) {
    // this.$el = options['$el'];
    this.game = options['game'];
    
    this.gameDifficulties = {
      'beginner': [8, 8, 10],
      'intermediate': [16, 16, 40],
      'expert': [30, 16, 99]
    }
    
    this.boardView = new Minesweeper.BoardView({
      $el: $("#board"), 
      board: this.game.board,
      difficulty: this.gameDifficulties['beginner']
    });
    
    $("input[name='difficulty']").change(this.changeBoardDifficulty.bind(this));
  }
  
  GameView.prototype.changeBoardDifficulty = function() {
    if (this.game.isStarted) {
      
    } else {
      var difficulty = $('input[name=difficulty]:checked').val();
      difficulty = this.gameDifficulties[difficulty];
      
      this.game = new Minesweeper.Game(difficulty);
      this.boardView.generateBoard(difficulty);
    };
  };
  
  
  
})(this);