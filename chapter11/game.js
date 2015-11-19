var Game = {
  SIZE: 4
};

Game.start = function() {
  Board.init();
  Draw.init();
  Score.init();
  Player.startListening();
}
