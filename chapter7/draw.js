var Draw = {
  POSITIONS: [
    [[], []],
    [[1/2, 1/2]],
    [[1/4, 1/4], [3/4, 3/4]],
    [[1/2, 1/2], [1/4, 1/4], [3/4, 3/4]],
    [[1/4, 1/4], [1/4, 3/4], [3/4, 3/4], [3/4, 1/4]]
  ],
  CELL: 60,
  LINE: 2,
  ATOM: 7,
  _context: null
};

/*
  Výroba canvasu a jeho configurace(příprava)
*/
Draw.init = function() {
  var canvas = document.createElement("canvas");

  this.CELL += this.LINE;

  var size = Game.SIZE * this.CELL + this.LINE;

  canvas.width = size;
  canvas.height = size;

  this._context = canvas.getContext("2d");
  this._context.lineWidth = this.LINE;

  document.body.appendChild(canvas);

  this.all();
}

Draw.all = function() {
  this._context.fillStyle = "#eee";
  var width = this._context.width;
  var height = this._context.height;

  this._context.fillRect(0, 0, width, height);

  this._lines();
  this._cells();
}


/*Vykreslit mrizku*/
Draw._lines = function() {
  this._context.beginPath();

  // vodorovne
  for (var i=0; i<Game.SIZE+1; i+=1) {
    var x = this.LINE/2 + i*this.CELL;
    this._context.moveTo(x, 0);
    this._context.lineTo(x, this._context.canvas.height);
  }

  for (var j=0; j<Game.SIZE+1; j+=1) {
    var y = this.LINE/2 + j*this.CELL;
    this._context.moveTo(0, y);
    this._context.lineTo(this._context.canvas.width, y);
  }

  this._context.stroke();
}

Draw._cells = function() {
  for (var i=0; i<Game.SIZE; i+=1) {
    for (var j=0; j<Game.SIZE; j+=1) {
      this._cell(i, j, Board.getAtoms(i, j));
    }
  }
}

Draw._cellShort = function(x, y, count) {
  var positions = this.POSITIONS[count];

  for (var i=0; i <positions.length; i+=1) {
    var position = positions[i];
    var posX = position[0];
    var posY = position[1];
    var atomX = (x + posX) * this.CELL;
    var atomY = (y + posY) * this.CELL;
    this._context.clearRect(x*this.CELL + this.LINE, y*this.CELL + this.LINE, this.CELL - this.LINE, this.CELL - this.LINE);
    this._atom(atomX, atomY);
  }
}

// vykresli atomy v bunce
Draw._cell = function(x, y, count) {
  x *= this.CELL;
  y *= this.CELL;

  switch (count) {
    case 1:
      this._context.clearRect(x + this.LINE, y + this.LINE, this.CELL - this.LINE, this.CELL - this.LINE);
      this._atom(x + this.CELL/2, y + this.CELL/2);
    break;

    case 2:
      this._context.clearRect(x + this.LINE, y + this.LINE, this.CELL - this.LINE, this.CELL - this.LINE);
      this._atom(x + this.CELL/4, y + this.CELL/4);
      this._atom(x + this.CELL*3/4, y + this.CELL*3/4);
    break;

    case 3:
      this._context.clearRect(x + this.LINE, y + this.LINE, this.CELL - this.LINE, this.CELL - this.LINE);
      this._atom(x + this.CELL/2, y + this.CELL/2);
      this._atom(x + this.CELL/4, y + this.CELL/4);
      this._atom(x + this.CELL*3/4, y + this.CELL*3/4);
    break;

    case 4:
      this._context.clearRect(x + this.LINE, y + this.LINE, this.CELL - this.LINE, this.CELL - this.LINE);
      this._atom(x + this.CELL/4, y + this.CELL/4);
      this._atom(x + this.CELL*3/4, y + this.CELL*3/4);
      this._atom(x + this.CELL/4, y + this.CELL*3/4);
      this._atom(x + this.CELL*3/4, y + this.CELL/4);
    break;
  }
}

// vykresli jednotlivy atom
Draw._atom = function(x, y) {
  this._context.beginPath();

  this._context.moveTo(x+this.ATOM, y);
  this._context.arc(x, y, this.ATOM, 0, 2*Math.PI, false);

  this._context.fillStyle = "blue";
  this._context.fill();
  this._context.stroke();
}

Draw.getPosition = function(cursorX, cursorY) {
  var rectangle = this._context.canvas.getBoundingClientRect();

  cursorX -= rectangle.left;
  cursorY -= rectangle.top;

  if (cursorX < 0 || cursorX > rectangle.width) { return null; }
  if (cursorY < 0 || cursorY > rectangle.height) { return null; }

  var cellX = Math.floor(cursorX / this.CELL);
  var cellY = Math.floor(cursorY / this.CELL);
  return [cellX, cellY];
}
