# L-System

class LS
	constructor: (opts) ->
		@options = _.defaults opts, {
			parameters: null
			fill: false
			foreground: "#00ACED"
			background: "#222222"
			lineColor: "#00ACED"
			lineWidth: 2
			zoom: 1
		}
		@parameters = @options.parameters
		@sequence = @parameters.axiom
		@iteration = 0
		@stack = [@parameters.axiom]
		@

	valid_actions =
		"none": (t, args) ->
		"forward": (t, args) -> t.go parseFloat args[1]
		"hop": (t, args) -> t.hop parseFloat args[1]
		"right": (t, args) -> t.right parseFloat args[1]
		"left": (t, args) -> t.left parseFloat args[1]
		"rotate": (t, args) -> t.turn parseFloat args[1]
		"branch": (t, args) -> t.set()
		"home": (t, args) -> t.home()

	setContext: (@ctx) -> @

	fold: () ->
		seq = @sequence
		i = 0

		if ++@iteration < @stack.length
			# This iteration already exists, load it from the stack
			@sequence = @stack[@iteration]
			return @
		
		# Generate next sequence
		# CoffeeScript ain't too good at plain ol' for loops
		while i < seq.length
			# Constants are ignored
			# if _.contains(@parameters.constants, seq[i]) then continue
			# Check for a rule for this character
			if _.has @parameters.rules, seq[i]
				rule = @parameters.rules[seq[i]]
				rule = rule.replace /\s/g, ''
				if _.isString rule
					# Deterministic L-System
					seq = seq.substring(0, i) + rule + seq.substring(i + 1)
					i += rule.length
				else
					# Stochastic L-System (probability)
					total = 0
					total += p for own r, p of rule
					rand = total * Math.random()
					sum = 0
					for own r, p of rule
						if sum < rand and rand < (sum += p)
							seq = seq.substring(0, i) + r + seq.substring(i + 1)
							i += r.length
							break
			else
				# possibly a constant?
				# throw new Error "No rule defined for variable '#{seq[i]}'"

			i++


		# `for (var i = 0; i < seq.length; i++) {
		# 	if (this.parameters.constants.indexOf(seq[i]) >= 0) continue;
		# 	if (this.parameters.rules.hasOwnProperty(seq[i])) {
		# 		rule = this.parameters.rules[seq[i]];
		# 		if (typeof rule === "string") {
		# 			// Deterministic L-System
		# 			seq = seq.substring(0, i) + rule + seq.substr(i + 1);
		# 			i += rule.length;
		# 		} else {
		# 			// Stochastic L-System (Probability!)
		# 			var total = 0;
		# 			for (var r in rule) {
		# 				if (rule.hasOwnProperty(r)) {
		# 					total += rule[r];
		# 				}
		# 			}
		# 			var rand = total * Math.random();
		# 			var sum = 0;
		# 			for (var r in rule) {
		# 				if (rule.hasOwnProperty(r)) {
		# 					if (sum < rand && rand < (sum += rule[r])) {
		# 						seq = seq.substring(0, i) + r + seq.substr(i + 1);
		# 						i += r.length;
		# 						break;
		# 					}
		# 				}
		# 			}
		# 		}
		# 	} else {
		# 		throw new Error("No rule defined for variable '" + seq[i] + "'");
		# 	}
		# }`
		@stack.push seq
		@sequence = seq
		@

	unfold: () ->
		@sequence = @stack[--@iteration] if @iteration > 0
		@

	render: (ctx) ->
		ctx = @ctx || ctx
		t = new Turtle(ctx)

		ctx.save()
		ctx.fillStyle = @options.background
		ctx.fillRect 0, 0, ctx.canvas.width, ctx.canvas.height
		ctx.scale FractalViewer.zoom, FractalViewer.zoom
		ctx.translate ctx.canvas.width / 2, ctx.canvas.height / 2
		t.strokeStyle @options.lineColor
		t.lineWidth @options.lineWidth
		ctx.fillStyle = @options.foreground
		ctx.translate FractalViewer.offsetX, FractalViewer.offsetY

		t.begin()
		actions = @parameters.actions

		for op in @sequence
			if _.has actions, op
				command = actions[op].split ' '
				if _.has valid_actions, command[0]
					valid_actions[command[0]].call @parameters, t, command

		if @options.fill then t.fill() else t.stroke()

		ctx.restore()
		@

	iterate: () ->
		@fold().render()

	regress: () ->
		@unfold().render()
