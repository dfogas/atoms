/*
  Přepsáním objektu Player na prototypový vzor dostáváme možnost
  jasněji formulovat jeji ukoly a odpovědnosti.
  Zároveň ztrácíme možnost přímého dotazování na metody ostatních
  objektů, což nás donutí
  vytvářet vazby s větším rozmyslem.
*/

//it goes like this
var Player = function(name, color) {
  this._name = name;
  this._color = color;
  this._score = document.createElement('span');

  var node = document.createElement("p");
  node.style.color = color;
  node.appendChild(document.createTextNode(name + ": "));
  node.appendChild(this._score);
  document.body.appendChild(node);
}

Player.Human = function(name, color) {
  Player.call(this, name, color);
}
Player.Human.prototype = Object.create(Player.prototype);

Player.AI = function(name, color) {
  Player.call(this, name, color);
}
Player.AI.prototype = Object.create(Player.prototype);

Player.prototype.getColor = function() {
  return this._color;
}

Player.prototype.setScore = function(score) {
  this._score.innerHTML = score;
}

// Player.prototype.play = function(board, draw, callback) {
// }

Player.Human.prototype.play = function(board, draw, callback) {
  this._callback = callback;
  this._draw = draw;
  document.body.addEventListener("click", this);
}

Player.Human.prototype.handleEvent = function(e) {
  var cursor = new XY(e.clientX, e.clientY);
  var position = this._draw.getPosition(cursor);
  if (!position) { return; }

  document.body.removeEventListener("click", this);

  this._callback(position);
}

Player.AI.prototype.play = function(board, draw, callback) {
  var available = [];

  for (var i=0; i<Game.SIZE; i+=1) {
    for (var j=0; j<Game.SIZE; j+=1) {
      var xy = new XY(i, j);
      var player = board.getPlayer(xy);
      if (!player || player == this) { available.push(xy); }
    }
  }

  var index = Math.floor(Math.random() * available.length);
  callback(available[index]);
}
