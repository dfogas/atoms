var Draw = function () {
  this.POSITIONS = [
    [[], []],
    [new XY(1/2, 1/2)],
		[new XY(1/4, 1/4), new XY(3/4, 3/4)],
		[new XY(1/2, 1/2), new XY(1/4, 1/4), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 3/4), new XY(3/4, 3/4), new XY(3/4, 1/4)],
		[new XY(1/2, 1/2), new XY(1/4, 1/4), new XY(1/4, 3/4), new XY(3/4, 3/4), new XY(3/4, 1/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(1/2, 1/2), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)],
		[new XY(1/4, 1/4), new XY(1/4, 1/2), new XY(1/4, 3/4), new XY(1/2, 1/4), new XY(1/2, 3/4), new XY(3/4, 1/4), new XY(3/4, 1/2), new XY(3/4, 3/4)]
  ];
  this.CELL = 60;
  this.LINE = 2;
  this.ATOM = 7;
  this._context = null;

  var canvas = document.createElement("canvas");

  this.CELL += this.LINE;

  var size = Game.SIZE * this.CELL + this.LINE;

  canvas.width = size;
  canvas.height = size;

  this._context = canvas.getContext("2d");
  this._context.lineWidth = this.LINE;
  this._context.fillStyle = "#000";
  this._context.fillRect(0, 0, size, size);

  for (var i=0; i<Game.SIZE; i+=1) {
    for (var j=0; j<Game.SIZE; j+=1) {
      this.cell(new XY(i, j));
    }
  }

  document.body.appendChild(canvas);
}

/* Vykreslit jednu buńku */
Draw.prototype.cell = function(xy, atoms, player) {
  /* nejprve premazat bilou */
  var size = this.CELL - this.LINE;
  var offset = new XY(this.LINE, this.LINE);
  var leftTop = xy.multiply(this.CELL).add(offset);

  this._context.fillStyle = "#fff";
  this._context.fillRect(leftTop.x, leftTop.y, size, size);

  /* zjistit pocet atomu */
  if (!atoms) { return; }

  /* zjistit hrace (barvu) */
  var color = player.getColor();

  /* a vykreslit je, stejne jako minule */
  var positions = this.POSITIONS[atoms];
  for (var i=0; i<positions.length; i+=1) {
    var position = positions[i];
    var atom = xy.add(position).multiply(this.CELL);
    this._atom(atom, color);
  }
}

// vykresli jednotlivy atom
Draw.prototype._atom = function(xy, color) {
  this._context.beginPath();

  this._context.moveTo(xy.x + this.ATOM, xy.y);
  this._context.arc(xy.x, xy.y, this.ATOM, 0, 2*Math.PI, false);

  this._context.fillStyle = color;
  this._context.fill();
  this._context.stroke();
}

// převod pozice kursoru na souřadnice buňky
Draw.prototype.getPosition = function(cursor) {
  var rectangle = this._context.canvas.getBoundingClientRect();

  cursor.x -= rectangle.left;
  cursor.y -= rectangle.top;

  if (cursor.x < 0 || cursor.x > rectangle.width) { return null; }
  if (cursor.y < 0 || cursor.y > rectangle.height) { return null; }

  return cursor.divide(this.CELL);
}
