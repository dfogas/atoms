var XY = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

XY.prototype.add = function(other) {
  return new XY(this.x + other.x, this.y + other.y);
}

XY.prototype.multiply = function(z) {
  return new XY(this.x*z, this.y*z);
}

XY.prototype.divide = function(z) {
  return new XY(Math.floor(this.x/z), Math.floor(this.y/z));
}

XY.prototype.equals = function(xy) {
  return (this.x == xy.x && this.y == xy.y);
}

XY.prototype.toString = function() {
  return this.x + "," + this.y;
}

XY.prototype.getNeighbors = function() {
  var results = [];
  if (this.x > 0)           { results.push(new XY(this.x-1, this.y)); }
  if (this.x+1 < Game.SIZE) { results.push(new XY(this.x+1, this.y)); }
  if (this.y > 0)           { results.push(new XY(this.x, this.y-1)); }
  if (this.y+1 < Game.SIZE) { results.push(new XY(this.x, this.y+1)); }
  return results;
}

// statická tovární metoda this
XY.fromString = function(str) {
  var parts = str.split(",");
  var x = Number(parts[0]);
  var y = Number(parts[1]);
  return new this(x, y);
}
