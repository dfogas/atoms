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
    this.onTurnDone(this._score);
  } else if (this._criticals.length) {
    this._explode();
  } else {/*přidání bez rozpadu či konce hry*/
    this.onTurnDone(this._score);
  }
}

Board.prototype._explode = function() {
  var xy = this._criticals.shift(); //take first from Array
  var cell = this._data[xy];

  var neighbors = xy.getNeighbors();
  cell.atoms -= neighbors.length;
  this._draw.cell(xy);

  for (var i=0; i<neighbors.length; i+=1) {
    var n = neighbors[i];
    this._addAndCheck(n, cell.player);
  }

  if (Game.isOver(this._score)) {
    this.onTurnDone(this._score);
  } else if (this._criticals.length) {
    setTimeout(this._explode.bind(this), this.DELAY);
  } else {
    this.onTurnDone(this._score);
  }
}
