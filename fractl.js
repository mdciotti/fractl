
var FractalViewer = {
	model: null,
	ctx: null,
	gui: null,
	editor: null,
	mouseX: 0,
	mouseY: 0,
	offsetX: 0,
	offsetY: 0,
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

FractalViewer.zoomIn = function () {
    var self = this;
    var id, d = 500, factor;
    var t0 = Date.now();
    function zoom() {
        id = window.requestAnimationFrame(zoom);
        factor = zf(Date.now() - t0, d);
        self.zoom *= factor;
        self.ctx.scale(factor, factor);
        self.model.render();
    }
    zoom();
    window.setTimeout(function () {
        window.cancelAnimationFrame(id);
    }, d);
};

FractalViewer.zoomOut = function () {
    var self = this;
    var id, d = 500, factor;
    var t0 = Date.now();
    function zoom() {
        id = window.requestAnimationFrame(zoom);
        factor = zf(Date.now() - t0, d);
        self.zoom /= factor;
        self.ctx.scale(1/factor, 1/factor);
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
		var model = FractalViewer.model = new LS({ parameters: newFractal });
		model.setContext(FractalViewer.ctx).render();

		// Create manipulation GUI
		if (FractalViewer.gui !== null) FractalViewer.gui.destroy();
		FractalViewer.gui = new dat.GUI();

		FractalViewer.gui.add(model, 'iterate');
		FractalViewer.gui.add(model, 'regress');

		var style = FractalViewer.gui.addFolder('Style');
		style.add(model.options, 'fill').onChange(function () { model.render(); });
		style.addColor(model.options, 'foreground').onChange(function () { model.render(); });
		style.addColor(model.options, 'background').onChange(function () { model.render(); });
		style.addColor(model.options, 'lineColor').onChange(function () { model.render(); });
		style.add(model.options, 'lineWidth').min(0).max(10).step(0.5).onChange(function () { model.render(); });
	};

	// Create GUI
	function updateRulesFolder(folder) {
		// Clear out current rules:
		_.each(folder.__controllers, folder.remove, folder);
		// Probably not supposed to touch __controllers, oops
		folder.__controllers = [];

		// Create new rules from variables:
		for (var rule in newFractal.rules) {
			if (_.has(newFractal.rules, rule)) {
				if (_.contains(newFractal.variables, rule)) {
					folder.add(newFractal.rules, rule);
				} else {
					delete newFractal.rules[rule];
				}
			}
		}
	}

	function updateActionsFolder(folder) {
		// Clear out current actions:
		_.each(folder.__controllers, folder.remove, folder);
		// Probably not supposed to touch __controllers, oops
		folder.__controllers = [];

		var possibleActions = _.union(
				newFractal.variables.split(''),
				newFractal.constants.split('')
			).join('');

		// Create new actions from variables and constants:
		for (var action in newFractal.actions) {
			if (_.has(newFractal.actions, action)) {
				if (_.contains(possibleActions, action)) {
					folder.add(newFractal.actions, action);
				} else {
					delete newFractal.actions[action];
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
		updateRulesFolder(rulesFolder);

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

		updateActionsFolder(actionsFolder);
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

		updateActionsFolder(actionsFolder);
	});

	editor.add(newFractal, 'axiom');
	// editor.add(newFractal, 'angle').min(0).max(360).step(1);

	var rulesFolder = editor.addFolder('Rules');
	updateRulesFolder(rulesFolder);

	var actionsFolder = editor.addFolder('Actions');
	updateActionsFolder(actionsFolder);
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
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild(canvas);

	FractalViewer.ctx = canvas.getContext('2d');

	// Load various L-S models
	// dat.GUI doesn't support saving and loading folders
	FractalViewer.guiState = makeGuiObjects(LSModels);

	FractalViewer.initialize();

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
