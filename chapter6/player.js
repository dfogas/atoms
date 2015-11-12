var Player = {};

Player.listen = function() {
  document.body.addEventListener("click", Player.click);
}

Player.click = function(e) {
  var position = Draw.getPosition(e.clientX, e.clientY);
  console.log('player click');
  console.log(position);
  if (!position) return;
  var x = position[0];
  var y = position[1];
  Board[x][y]++;
  console.log(Board[x][y]);
  Draw.all();
}
