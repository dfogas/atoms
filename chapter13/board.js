var Board = function(players, draw) {
  this.DELAY = 500;
  this.onTurnDone = function() {};

  this._draw = draw;
  this._data = {};
  this._criticals = [];

  this._players = players;
  this._score = [];
  for (var i=0; i<players.length; i+=1) { this._score.push(0); }
  this._build();
};

// Shape of Board data { coordinate1asstring: cellobject }
Board.prototype._build = function() {
  for (var i=0; i < Game.SIZE; i +=1) {
    for (var j=0; j < Game.SIZE; j +=1) {
      var xy = new XY(i, j);
      var limit = this._getLimit(xy);
      var cell = {
        atoms: 0,
        limit: limit,
        player: null
      }
      this._data[xy] = cell;
    }
  }
}

Board.prototype.getScoreFor = function(player) {
  var index = this._players.indexOf(player);
  return this._score[index];
}

Board.prototype.clone = function() {
  var clone = new Board(this._players, null);

  clone._score = this._score.slice(0);

  for (var p in this._data) {
    var ourCell = this._data[p];
    var cloneCell = clone._data[p];
    cloneCell.atoms = ourCell.atoms;
    cloneCell.player = ourCell.player;
  }

  return clone;
}

// for draw and player components
Board.prototype.getPlayer = function(xy) {
  return this._data[xy].player;
}

Board.prototype._getLimit = function(xy) {
  return xy.getNeighbors().length;
}

Board.prototype._addAndCheck = function(xy, player) {
  var cell = this._data[xy];

  if (cell.player) {/*odebrat předchozímu je-li*/
    var oldPlayerIndex = this._players.indexOf(cell.player);
    this._score[oldPlayerIndex]-=1;
  }

  /*přidat bod novému*/
  var playerIndex = this._players.indexOf(player);
  this._score[playerIndex]+=1;

  cell.player = player;
  cell.atoms +=1;

  /*nova podminka pro synchronni AI simulaci boardu*/
  if (this._draw)
    this._draw.cell(xy, cell.atoms, cell.player);

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

Board.prototype.addAtom = function(xy, player) {
  this._addAndCheck(xy, player);

  if (Game.isOver(this._score)) {
    this.onTurnDone();
  } else if (this._criticals.length) {
    this._explode();
  } else {/*přidání bez rozpadu či konce hry*/
    this.onTurnDone();
  }
}

Board.prototype._explode = function() {
  var xy = this._criticals.shift(); //take first from Array
  var cell = this._data[xy];

  var neighbors = xy.getNeighbors();
  cell.atoms -= neighbors.length;

  if (this._draw)
    this._draw.cell(xy);

  for (var i=0; i<neighbors.length; i+=1) {
    var n = neighbors[i];
    this._addAndCheck(n, cell.player);
  }

  if (Game.isOver(this._score)) {
    this.onTurnDone();
  } else if (this._criticals.length) {
    /*nova podminka pro synchronni AI simulaci boardu*/
    if (this._draw)
      setTimeout(this._explode.bind(this), this.DELAY);
    else
      this._explode();
  } else {
    this.onTurnDone();
  }
}
