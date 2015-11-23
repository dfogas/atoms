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
  var scores = {};

  for (var i=0; i<Game.SIZE; i+=1) {
    for (var j=0; j<Game.SIZE; j+=1) {
      var xy = new XY(i, j);
      var player = board.getPlayer(xy);
      if (player && player != this) { continue; }
      scores[xy] = this._getScore(board, xy);
    }
  }

  var best = this._pickBest(scores);
  callback(best);
}

Player.AI.prototype._getScore = function(board, xy) {
  var clone = board.clone();
  clone.addAtom(xy, this);
  return clone.getScoreFor(this);
}

// {key: value} -> Number
Player.AI.prototype._pickBest = function(scores) {
  var positions =[];
  var best = 0;

  for (var p in scores) {
    if (scores[p] > best) {
      best = scores[p];
      positions = [];
    }

    if (scores[p] == best) { positions.push(p); }
  }

  // in positions we have strings a, b, but we need to return XY type;
  var position = positions[Math.floor(Math.random() * positions.length)];
  return XY.fromString(position);
}
