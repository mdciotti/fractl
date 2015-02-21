var LS,
  __hasProp = {}.hasOwnProperty;

LS = (function() {
  var valid_actions;

  function LS(opts) {
    this.options = _.defaults(opts, {
      parameters: null,
      fill: false,
      foreground: "#00ACED",
      background: "#222222",
      lineColor: "#00ACED",
      lineWidth: 2,
      zoom: 1
    });
    this.parameters = this.options.parameters;
    this.sequence = this.parameters.axiom;
    this.iteration = 0;
    this.stack = [this.parameters.axiom];
    this;
  }

  valid_actions = {
    "none": function(t, args) {},
    "forward": function(t, args) {
      return t.go(parseFloat(args[1]));
    },
    "hop": function(t, args) {
      return t.hop(parseFloat(args[1]));
    },
    "right": function(t, args) {
      return t.right(parseFloat(args[1]));
    },
    "left": function(t, args) {
      return t.left(parseFloat(args[1]));
    },
    "rotate": function(t, args) {
      return t.turn(parseFloat(args[1]));
    },
    "branch": function(t, args) {
      return t.set();
    },
    "home": function(t, args) {
      return t.home();
    }
  };

  LS.prototype.setContext = function(ctx) {
    this.ctx = ctx;
    return this;
  };

  LS.prototype.fold = function() {
    var i, p, r, rand, rule, seq, sum, total;
    seq = this.sequence;
    i = 0;
    if (++this.iteration < this.stack.length) {
      this.sequence = this.stack[this.iteration];
      return this;
    }
    while (i < seq.length) {
      if (_.has(this.parameters.rules, seq[i])) {
        rule = this.parameters.rules[seq[i]];
        rule = rule.replace(/\s/g, '');
        if (_.isString(rule)) {
          seq = seq.substring(0, i) + rule + seq.substring(i + 1);
          i += rule.length;
        } else {
          total = 0;
          for (r in rule) {
            if (!__hasProp.call(rule, r)) continue;
            p = rule[r];
            total += p;
          }
          rand = total * Math.random();
          sum = 0;
          for (r in rule) {
            if (!__hasProp.call(rule, r)) continue;
            p = rule[r];
            if (sum < rand && rand < (sum += p)) {
              seq = seq.substring(0, i) + r + seq.substring(i + 1);
              i += r.length;
              break;
            }
          }
        }
      } else {

      }
      i++;
    }
    this.stack.push(seq);
    this.sequence = seq;
    return this;
  };

  LS.prototype.unfold = function() {
    if (this.iteration > 0) {
      this.sequence = this.stack[--this.iteration];
    }
    return this;
  };

  LS.prototype.render = function(ctx) {
    var actions, command, op, t, _i, _len, _ref;
    ctx = this.ctx || ctx;
    t = new Turtle(ctx);
    ctx.save();
    ctx.fillStyle = this.options.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.scale(FractalViewer.zoom, FractalViewer.zoom);
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    t.strokeStyle(this.options.lineColor);
    t.lineWidth(this.options.lineWidth);
    ctx.fillStyle = this.options.foreground;
    ctx.translate(FractalViewer.offsetX, FractalViewer.offsetY);
    t.begin();
    actions = this.parameters.actions;
    _ref = this.sequence;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      op = _ref[_i];
      if (_.has(actions, op)) {
        command = actions[op].split(' ');
        if (_.has(valid_actions, command[0])) {
          valid_actions[command[0]].call(this.parameters, t, command);
        }
      }
    }
    if (this.options.fill) {
      t.fill();
    } else {
      t.stroke();
    }
    ctx.restore();
    return this;
  };

  LS.prototype.iterate = function() {
    return this.fold().render();
  };

  LS.prototype.regress = function() {
    return this.unfold().render();
  };

  return LS;

})();
