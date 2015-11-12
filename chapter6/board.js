var Board = [];

for (var i=0; i < Game.SIZE; i += 1) {
  Board.push([]);
  for (var j=0; j < Game.SIZE; j +=1) {
    Board[i].push(0);
  }
}
