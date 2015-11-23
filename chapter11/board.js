var Board = {
  DELAY: 500,
  _data: {},
  _criticals: []
};

// Shape of Board data { coordinate1asstring: cellobject }
Board.init = function() {
  for (var i=0; i < Game.SIZE; i +=1) {
    for (var j=0; j < Game.SIZE; j +=1) {
      var xy = new XY(i, j);
      var limit = this._getLimit(xy);
      var cell = {
        atoms: 0,
        limit: limit,
        player: -1
      }
      this._data[xy] = cell;
    }
  }
}

// for draw and player components
Board.getPlayer = function(xy) {
  return this._data[xy].player;
}

Board._getLimit = function(xy) {
  return xy.getNeighbors().length;
}

Board.getAtoms = function(xy) {
  return this._data[xy].atoms;
}

Board._addAndCheck = function(xy, player) {
  var cell = this._data[xy];

  Score.removePoint(cell.player);
  Score.addPoint(player);

  cell.atoms++;
  cell.player = player;

  Draw.cell(xy);

  if (cell.atoms > cell.limit) {
    // pokud už je ve frontě kritických
    for (var i=0; i<this._criticals.length; i+=1) {
      var tmp = this._criticals[i];
      if (tmp.equals(xy)) { return; }
    }
    // není-li, přidáme
    this._criticals.push(xy);
  }
}

Board.addAtom = function(xy, player) {
  this._addAndCheck(xy, player);

  if (Score.isGameOver()) {
    return;
  } else if (this._criticals.length > 0) {
    Player.stopListening();
    this._explode();
  }
}

Board._explode = function() {
  var xy = this._criticals.shift(); //take first from Array
  console.log(xy);
  var cell = this._data[xy];
  console.log(cell);

  var neighbors = xy.getNeighbors();
  cell.atoms -= neighbors.length;
  Draw.cell(xy);

  for (var i=0; i<neighbors.length; i+=1) {
    var n = neighbors[i];
    this._addAndCheck(n, cell.player);
  }

  if (Score.isGameOver()) {
    return;
  } else if (this._criticals.length) {
    setTimeout(this._explode.bind(this), this.DELAY);
  } else {
    Player.startListening();
  }
}
