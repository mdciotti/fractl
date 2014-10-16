# Turtle Graphics

class Turtle
	constructor: (@ctx) ->
		@x = 0
		@y = 0
		@ox = 0
		@oy = 0
		@dir = -90
		@cos = 0
		@sin = -1
		@pen = true
		@homes = []
		# @ctx.beginPath()

	RAD = Math.PI / 180.0

	toRad = (deg) ->
		deg * RAD

	fillStyle: (color) ->
		@ctx.fillStyle = color
		@

	strokeStyle: (color) ->
		@ctx.strokeStyle = color
		@

	lineWidth: (px) ->
		@ctx.lineWidth = px
		@

	set: () ->
		@homes.push { x: @x, y: @y, angle: @dir }
		@

	home: () ->
		home = @homes.pop()
		@dir = home.angle
		@jump home.x, home.y

	angle: (deg) ->
		@dir = deg - 90
		a = toRad @dir
		@cos = Math.cos a
		@sin = Math.sin a
		@

	go: (r) ->
		@goto @x + r * @cos, @y + r * @sin

	hop: (r) ->
		@jump @x + r * @cos, @y + r * @sin

	back: (r) ->
		@turn -180
		@go r
		@turn 180

	stroke: () ->
		@ctx.stroke()
		@

	fill: () ->
		@ctx.fill()
		@

	begin: () ->
		@ctx.beginPath()
		@ctx.moveTo @ox, @oy
		@

	close: () ->
		@ctx.closePath()
		@

	penup: () ->
		@pen = false
		@

	pendown: () ->
		@pen = true
		@

	goto: (@x, @y) ->
		if @pen
			@ctx.lineTo @x, @y
		else
			@ctx.moveTo @x, @y

		@

	polar: (r, angle) ->
		a = toRad @dir + angle
		@goto @ox + r * Math.cos a, @oy + r * Math.cos a

	jump: (x, y) ->
		@penup()
		@goto x, y
		@pendown()

	turn: (deg) ->
		@dir = (@dir + deg) % 360
		a = toRad @dir
		@cos = Math.cos a
		@sin = Math.sin a
		@

	up: (r) ->
		@goto @x, @y - r

	down: (r) ->
		@goto @x, @y + r

	left: (r) ->
		@goto @x - r, @y

	right: (r) ->
		@goto @x + r, @y

	origin: () ->
		@ox = @x
		@oy = @y
		@
