var Player = {
  _current: 0
};

Player.startListening = function() {
  document.body.addEventListener("click", Player);
}

Player.stopListening = function() {
  document.body.removeEventListener("click", Player);
}

// Co se stane, když hráč klikne myší
Player.handleEvent = function(e) {
  var cursor = new XY(e.clientX, e.clientY);
  var position = Draw.getPosition(cursor);
  if (!position) return;

  /* test na majitele buňky */
  var existing = Board.getPlayer(position);
  if (existing != -1 && existing != this._current) { return; }

  Board.addAtom(position, this._current);
  this._current = (this._current + 1) % Score.getPlayerCount();
  // console.log(Board._data);
}
