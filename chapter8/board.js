var Board = {
  DELAY: 500,
  _data: [],
  _criticals: []
};

Board.init = function() {
  for (var i=0; i < Game.SIZE; i += 1) {
    this._data.push([]);
    for (var j=0; j < Game.SIZE; j +=1) {
      var limit = this._getLimit(i, j);
      var cell = {
        atoms: 0,
        limit: limit
      }
      this._data[i].push(cell);
    }
  }
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

Board._addAndCheck = function(x, y) {
  var cell = this._data[x][y];
  cell.atoms++;
  if (cell.atoms > cell.limit) { this._criticals.push([x, y]); }

  Draw.cell(x, y);
}

Board.addAtom = function(x, y) {
  this._addAndCheck(x, y);

  if (this._criticals.length > 0) {
    Player.stopListening();
    this._explode();
  }
}

Board._explode = function() {
  var pair = this._criticals.shift();
  var x = pair[0];
  var y = pair[1];
  var cell = this._data[x][y];

  var neighbors = this._getNeighbors(x, y);
  cell.atoms -= neighbors.length;
  Draw.cell(x, y);

  for (var i=0; i<neighbors.length; i+=1) {
    var n = neighbors[i];
    this._addAndCheck(n[0], n[1]);
  }

  if (this._criticals.length) {
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
