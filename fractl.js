
var FractalViewer = {
	model: null,
	ctx: null,
	zctx: null,
	gui: null,
	editor: null,
	mouseX: 0,
	mouseY: 0,
	offsetX: 0,
	offsetY: 0,
	viewWidth: 0,
	viewHeight: 0,
	dragging: false,
	zoom: 1,
	guiState: {}
};

function zf(t, d) {
    // Returns the zoom factor from time percent
    // Using a cubic easing function
    // t = elapsed time { t | 0 <= t <= d }
    // d = duration
    return 1 + 0.02*Math.pow(1-t/d, 3);
}

FractalViewer.zoomIn_old = function (d) {
    var self = this;
    var id, factor;
    var d = d || 500;
    var t0 = Date.now();
    function zoom() {
        id = window.requestAnimationFrame(zoom);
        factor = zf(Date.now() - t0, d);
        self.zoom *= factor;
        // self.ctx.scale(factor, factor);
        self.model.render();
    }
    zoom();
    window.setTimeout(function () {
        window.cancelAnimationFrame(id);
    }, d);
};

FractalViewer.zoomIn = function (d) {
    var self = this;
    var d = d || 500;
    var ow = self.ctx.canvas.width, oh = self.ctx.canvas.height;

    if (self.zctx.canvas.classList.contains('zoom-out')) return;

    self.zctx.canvas.style.zIndex = 1;
    self.zctx.drawImage(self.ctx.canvas, 0, 0, ow, oh);
    self.zctx.canvas.classList.add('zoom-in');
    self.ctx.fillStyle = self.model.options.background;
    self.ctx.fillRect(0, 0, ow, oh);
    self.zoom *= 1.25;

    window.setTimeout(function () {
        self.model.render();
    	self.zctx.canvas.classList.remove('zoom-in');
    	self.zctx.canvas.style.zIndex = -1;
    }, d);
};

FractalViewer.zoomOut = function (d) {
    var self = this;
    var d = d || 500;
    var ow = self.ctx.canvas.width, oh = self.ctx.canvas.height;

    if (self.zctx.canvas.classList.contains('zoom-in')) return;

    self.zctx.canvas.style.zIndex = 1;
    self.zctx.drawImage(self.ctx.canvas, 0, 0, ow, oh);
    self.zctx.canvas.classList.add('zoom-out');
    self.ctx.fillStyle = self.model.options.background;
    self.ctx.fillRect(0, 0, ow, oh);
    self.zoom *= 0.8;

    window.setTimeout(function () {
        self.model.render();
    	self.zctx.canvas.classList.remove('zoom-out');
    	self.zctx.canvas.style.zIndex = -1;
    }, d);
};

FractalViewer.zoomOut_old = function (d) {
    var self = this;
    var id, d = 500, factor;
    var d = d || 500;
    var t0 = Date.now();
    function zoom() {
        id = window.requestAnimationFrame(zoom);
        factor = zf(Date.now() - t0, d);
        self.zoom /= factor;
        // self.ctx.scale(1/factor, 1/factor);
        self.model.render();
    }
    zoom();
    window.setTimeout(function () {
        window.cancelAnimationFrame(id);
    }, d);
};

FractalViewer.initialize = function () {
	var i = 1, j = 1;

	if (FractalViewer.editor !== null) FractalViewer.editor.destroy();

	// Hash of valid actions
	var actionsList = {
		"None": "none",
		"Move Forward": "forward",
		"Hop Forward": "hop",
		"Rotate": "rotate",
		"Move Right": "right",
		"Move Left": "left",
		"Move Up": "up",
		"Move Down": "down",
		"Branch": "branch",
		"Home": "home",
	};

	var newFractal = LSModels[0];

	// Add compilation function
	newFractal.compile = function () {
		// console.log(FractalViewer.editor.getSaveObject());
		// Compile parameters into L-System
		var models = JSON.parse(FractalViewer.LSModels_JSON);
		var fractal = _.findWhere(models, { "name": newFractal.name });
		var model = FractalViewer.model = new LS({ parameters: fractal });
		model.setContext(FractalViewer.ctx).render();

		// Create manipulation GUI
		if (FractalViewer.gui !== null) FractalViewer.gui.destroy();
		FractalViewer.gui = new dat.GUI();

		FractalViewer.gui.add(model, 'sequence').listen().onChange(function () { model.render(); });
		FractalViewer.gui.add(model, 'iterate');
		FractalViewer.gui.add(model, 'regress');
		FractalViewer.gui.add(model, 'resetViewport');

		var style = FractalViewer.gui.addFolder('Style');
		style.add(model.options, 'fill').onChange(function () { model.render(); });
		style.addColor(model.options, 'foreground').onChange(function () { model.render(); });
		style.addColor(model.options, 'background').onChange(function () { model.render(); });
		style.addColor(model.options, 'lineColor').onChange(function () { model.render(); });
		style.add(model.options, 'lineWidth').min(0).max(10).step(0.5).onChange(function () { model.render(); });
	};

	// Create GUI
	function updateRulesFolder(folder, preset) {
		// Clear out current rules:
		_.each(folder.__controllers, folder.remove, folder);
		// Probably not supposed to touch __controllers, oops
		folder.__controllers = [];

		var models = JSON.parse(FractalViewer.LSModels_JSON);
		var fractal = _.findWhere(models, { "name": preset });
		// console.log(preset, fractal.rules);

		// Create new rules from variables:
		for (var rule in fractal.rules) {
			if (_.has(fractal.rules, rule)) {
				if (_.contains(fractal.variables, rule)) {
					folder.add(fractal.rules, rule);
				} else {
					delete fractal.rules[rule];
				}
			}
		}
	}

	function updateActionsFolder(folder, preset) {
		// Clear out current actions:
		_.each(folder.__controllers, folder.remove, folder);
		// Probably not supposed to touch __controllers, oops
		folder.__controllers = [];

		var models = JSON.parse(FractalViewer.LSModels_JSON);
		var fractal = _.findWhere(models, { "name": preset });

		var possibleActions = _.union(
				fractal.variables.split(''),
				fractal.constants.split('')
			).join('');

		// Create new actions from variables and constants:
		for (var action in fractal.actions) {
			if (_.has(fractal.actions, action)) {
				if (_.contains(possibleActions, action)) {
					folder.add(fractal.actions, action);
				} else {
					delete fractal.actions[action];
				}
			}
		}
	}

	// Create GUI for L-System parameters
	var editor = FractalViewer.editor = new dat.GUI({
		load: FractalViewer.guiState,
		preset: 'Dragon Curve'
	});
	editor.remember(newFractal);
	// editor.revert();
	// editor.save();
	editor.add(newFractal, 'compile');
	editor.add(newFractal, 'name');
	editor.add(newFractal, 'variables').onChange(function (vars) {
		// How to deal with items that are both in variables and constants?
		// For now, just assume any overlap is a variable

		// Update Rules
		var newVars = vars.replace(/\s/g, '').split('');
		_.each(newVars, function (v) {
			if (!_.has(newFractal.rules, v)) {
				// Looks like this rule doesn't exist yet, let's create it:
				newFractal.rules[v] = "";
			}
		});
		updateRulesFolder(rulesFolder, editor.preset);

		// Update Actions
		var possibleActions = _.union(
				newFractal.constants.replace(/\s/g, '').split(''),
				newVars
			);
		_.each(possibleActions, function (x) {
			if (!_.has(newFractal.actions, x)) {
				// Looks like this action doesn't exist yet, let's create it:
				newFractal.actions[x] = "none";
			}
		});

		updateActionsFolder(actionsFolder, editor.preset);
	});

	editor.add(newFractal, 'constants').onChange(function (constants) {
		// How to deal with items that are both in variables and constants?
		// For now, just assume any overlap is a variable

		// Update Actions
		var possibleActions = _.union(
				newFractal.variables.replace(/\s/g, '').split(''),
				constants.replace(/\s/g, '').split('')
			);
		_.each(possibleActions, function (x) {
			if (!_.has(newFractal.actions, x)) {
				// Looks like this action doesn't exist yet, let's create it:
				newFractal.actions[x] = "none";
			}
		});	

		updateActionsFolder(actionsFolder, editor.preset);
	});

	editor.add(newFractal, 'axiom');
	// editor.add(newFractal, 'angle').min(0).max(360).step(1);

	var rulesFolder = editor.addFolder('Rules');
	updateRulesFolder(rulesFolder, editor.preset);

	var actionsFolder = editor.addFolder('Actions');
	updateActionsFolder(actionsFolder, editor.preset);
};

function makeGuiObjects(JSON) {
	// Converts the JSON L-S model to a dat.GUI-compatible format
	// WHY DOESN'T dat.GUI SAVE THE VALUES OF ITEMS IN FOLDERS????
	// TODO: fix dat.GUI so that it fucking supports saving folders
	var guiObj = {closed: false, remembered: {}};
	_.each(JSON, function (preset) {
		guiObj.remembered[preset.name] = {
			"0": _.omit(preset, 'rules', 'actions')
		};
		var rules = {"default": {"0": {}}};
		for (var rule in preset.rules) {
			if (_.has(preset.rules, rule)) {
				// console.log(rules, rule);
				rules["default"]["0"][rule] = preset.rules[rule];
			}
		}
		var actions = {"default": {"0": {}}};
		for (var action in preset.actions) {
			if (_.has(preset.actions, action)) {
				actions["default"]["0"][action] = preset.actions[action];
			}
		}
		guiObj.folders = {
			"Rules": {closed: false, remembered: rules, preset: "default"},
			"Actions": {closed: false, remembered: actions, preset: "default"}
		};
	});
	// console.log(guiObj);
	return guiObj;
}

window.addEventListener('load', function () {
	var canvas = document.createElement('canvas');
	FractalViewer.viewWidth = canvas.width = window.innerWidth;
	FractalViewer.viewHeight = canvas.height = window.innerHeight;
	FractalViewer.ctx = canvas.getContext('2d');
	document.body.appendChild(canvas);

    var zcanvas = document.createElement('canvas');
    zcanvas.width = FractalViewer.viewWidth;
    zcanvas.height = FractalViewer.viewHeight;
    zcanvas.style.position = "absolute";
    zcanvas.style.left = "0";
    zcanvas.style.top = "0";
    zcanvas.style.zIndex = -1;
    FractalViewer.zctx = zcanvas.getContext('2d');
    document.body.appendChild(zcanvas);

	// Load various L-S models
	// dat.GUI doesn't support saving and loading folders
	FractalViewer.LSModels_JSON = JSON.stringify(LSModels);
	FractalViewer.guiState = makeGuiObjects(LSModels);

	FractalViewer.initialize();

	window.addEventListener('resize', function (e) {
		FractalViewer.viewWidth = zcanvas.width = canvas.width = window.innerWidth;
		FractalViewer.viewHeight = zcanvas.height = canvas.height = window.innerHeight;
		// FractalViewer.model.render();
	}, false);
	canvas.addEventListener('mousedown', function (e) {
		FractalViewer.dragging = true;
		FractalViewer.mouseX = e.clientX;
		FractalViewer.mouseY = e.clientY;
	}, false);
	document.addEventListener('mousemove', function (e) {
		if (!FractalViewer.dragging) return;
		FractalViewer.offsetX += (e.clientX - FractalViewer.mouseX) / FractalViewer.zoom;
		FractalViewer.offsetY += (e.clientY - FractalViewer.mouseY) / FractalViewer.zoom;
		FractalViewer.mouseX = e.clientX;
		FractalViewer.mouseY = e.clientY;
		FractalViewer.model.render();
	}, false);
	document.addEventListener('mouseup', function (e) {
		FractalViewer.dragging = false;
	}, false);
	document.addEventListener('keyup', function (e) {
		if (e.target !== document.body) return;
		switch (e.which) {
			case 37: FractalViewer.model.regress(); break;
			case 39: FractalViewer.model.iterate(); break;
			case 38: FractalViewer.zoomIn(); break;
			case 40: FractalViewer.zoomOut(); break;
			default: break;
		}
	}, false);
}, false);
