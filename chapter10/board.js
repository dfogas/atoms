var Board = {
  DELAY: 500,
  _data: [],
  _criticals: []
};

// Shape of Board data [[{atoms: Number, limit: Number(dynamically calculated)}]...]
// data.length = Game.SIZE^2;
Board.init = function() {
  for (var i=0; i < Game.SIZE; i += 1) {
    this._data.push([]);
    for (var j=0; j < Game.SIZE; j +=1) {
      var limit = this._getLimit(i, j);
      var cell = {
        atoms: 0,
        limit: limit,
        player: -1
      }
      this._data[i].push(cell);
    }
  }
}

Board.getPlayer = function(x, y) {
  return this._data[x][y].player;
}

Board._getLimit = function(x, y) {
  var limit = 4;
  if (x == 0 || x+1 == Game.SIZE) { limit--; }
  if (y == 0 || y+1 == Game.SIZE) { limit--; }
  return limit;
}

Board.getAtoms = function(x, y) {
  return this._data[x][y].atoms;
}

Board._addAndCheck = function(x, y, player) {
  var cell = this._data[x][y];

  Score.removePoint(cell.player);
  Score.addPoint(player);

  cell.atoms++;
  cell.player = player;

  Draw.cell(x, y);

  if (cell.atoms > cell.limit) {
    // pokud už je ve frontě kritických
    for (var i=0; i<this._criticals.length; i+=1) {
      var tmp = this._criticals[i];
      if (tmp[0] == x && tmp[1] == y) { return; }
    }
    // není-li, přidáme
    this._criticals.push([x, y]);
  }
}

Board.addAtom = function(x, y, player) {
  this._addAndCheck(x, y, player);

  if (Score.isGameOver()) {
    return;
  } else if (this._criticals.length > 0) {
    Player.stopListening();
    this._explode();
  }
}

Board._explode = function() {
  var pair = this._criticals.shift(); //take first from Array
  var x = pair[0];
  var y = pair[1];
  var cell = this._data[x][y];

  var neighbors = this._getNeighbors(x, y);
  cell.atoms -= neighbors.length;
  Draw.cell(x, y);

  for (var i=0; i<neighbors.length; i+=1) {
    var n = neighbors[i];
    this._addAndCheck(n[0], n[1], cell.player);
  }

  if (Score.isGameOver()) {
    return;
  } else if (this._criticals.length) {
    setTimeout(this._explode.bind(this), this.DELAY);
  } else {
    Player.startListening();
  }
}

Board._getNeighbors = function(x, y) {
  var results = [];
  if (x > 0) { results.push([x - 1, y]); }
  if (x + 1 < Game.SIZE) { results.push([x + 1, y]); }
  if (y > 0) { results.push([x, y - 1]); }
  if (y + 1 < Game.SIZE) { results.push([x, y + 1]); }
  return results;
}
