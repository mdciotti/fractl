var Turtle;

Turtle = (function() {
  var RAD, toRad;

  function Turtle(ctx) {
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.ox = 0;
    this.oy = 0;
    this.dir = -90;
    this.cos = 0;
    this.sin = -1;
    this.pen = true;
    this.homes = [];
  }

  RAD = Math.PI / 180.0;

  toRad = function(deg) {
    return deg * RAD;
  };

  Turtle.prototype.fillStyle = function(color) {
    this.ctx.fillStyle = color;
    return this;
  };

  Turtle.prototype.strokeStyle = function(color) {
    this.ctx.strokeStyle = color;
    return this;
  };

  Turtle.prototype.lineWidth = function(px) {
    this.ctx.lineWidth = px;
    return this;
  };

  Turtle.prototype.set = function() {
    this.homes.push({
      x: this.x,
      y: this.y,
      angle: this.dir
    });
    return this;
  };

  Turtle.prototype.home = function() {
    var home;
    home = this.homes.pop();
    this.dir = home.angle;
    return this.jump(home.x, home.y);
  };

  Turtle.prototype.angle = function(deg) {
    var a;
    this.dir = deg - 90;
    a = toRad(this.dir);
    this.cos = Math.cos(a);
    this.sin = Math.sin(a);
    return this;
  };

  Turtle.prototype.go = function(r) {
    return this.goto(this.x + r * this.cos, this.y + r * this.sin);
  };

  Turtle.prototype.hop = function(r) {
    return this.jump(this.x + r * this.cos, this.y + r * this.sin);
  };

  Turtle.prototype.back = function(r) {
    this.turn(-180);
    this.go(r);
    return this.turn(180);
  };

  Turtle.prototype.stroke = function() {
    this.ctx.stroke();
    return this;
  };

  Turtle.prototype.fill = function() {
    this.ctx.fill();
    return this;
  };

  Turtle.prototype.begin = function() {
    this.ctx.beginPath();
    this.ctx.moveTo(this.ox, this.oy);
    return this;
  };

  Turtle.prototype.close = function() {
    this.ctx.closePath();
    return this;
  };

  Turtle.prototype.penup = function() {
    this.pen = false;
    return this;
  };

  Turtle.prototype.pendown = function() {
    this.pen = true;
    return this;
  };

  Turtle.prototype.goto = function(x, y) {
    this.x = x;
    this.y = y;
    if (this.pen) {
      this.ctx.lineTo(this.x, this.y);
    } else {
      this.ctx.moveTo(this.x, this.y);
    }
    return this;
  };

  Turtle.prototype.polar = function(r, angle) {
    var a;
    a = toRad(this.dir + angle);
    return this.goto(this.ox + r * Math.cos(a, this.oy + r * Math.cos(a)));
  };

  Turtle.prototype.jump = function(x, y) {
    this.penup();
    this.goto(x, y);
    return this.pendown();
  };

  Turtle.prototype.turn = function(deg) {
    var a;
    this.dir = (this.dir + deg) % 360;
    a = toRad(this.dir);
    this.cos = Math.cos(a);
    this.sin = Math.sin(a);
    return this;
  };

  Turtle.prototype.up = function(r) {
    return this.goto(this.x, this.y - r);
  };

  Turtle.prototype.down = function(r) {
    return this.goto(this.x, this.y + r);
  };

  Turtle.prototype.left = function(r) {
    return this.goto(this.x - r, this.y);
  };

  Turtle.prototype.right = function(r) {
    return this.goto(this.x + r, this.y);
  };

  Turtle.prototype.origin = function() {
    this.ox = this.x;
    this.oy = this.y;
    return this;
  };

  return Turtle;

})();
