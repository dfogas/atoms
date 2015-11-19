var Score = {
  _players: [
    {
      color: "blue",
      name: "Hráč modrý",
      score: 0,
      node: null
    }, {
      color: "red",
      name: "Hráč červený",
      score: 0,
      node: null
    }
  ],
  _gameOver: false
}

Score.init = function() {
  for (var i=0; i<this._players.length; i+=1) {
    var obj = this._players[i];
    obj.node = document.createElement("span");

    var p = document.createElement("p");
    p.style.color = obj.color;
    p.appendChild(document.createTextNode(obj.name + ": "));
    p.appendChild(obj.node);

    document.body.appendChild(p);
  }
}

Score.getColor = function(player) {
  return this._players[player].color;
}

Score.getPlayerCount = function() {
  return this._players.length;
}

Score.isGameOver = function() {
  return this._gameOver;
}

Score.removePoint = function(player) {
  /* test, že buňka není prázdná */
  if (player == -1) { return; }

  var obj = this._players[player];
  obj.score--;
  obj.node.innerHTML = obj.score;
}

Score.addPoint = function(player) {
  var obj = this._players[player];
  obj.score++;
  obj.node.innerHTML = obj.score;

  /* může dojít ke skončení hry */
  if (obj.score == Game.SIZE * Game.SIZE) {
    Player.stopListening();
    this._gameOver = true;
    alert("Game Over.");
  }
}
