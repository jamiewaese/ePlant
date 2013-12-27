/**
 * EFP View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function EFPView(element, diagram) {
	this.element = element;
	this.diagram = diagram;

	this.width = null;
	this.height = null;
	this.webService = null;
	this.labels = [];
	this.control = null;
	this.outline = null;
	this.groups = [];
	this.viewObjects = [];

	this.isDataReady = false;

	this.mode = "absolute";

	this.maxLevel = 0;

	this.groupTooltips = [];
	this.groupTooltipCountdown = null;

	/* Create view-specific UI elements */
	this.modeContainerElement = document.createElement("div");
	this.modeContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.modeContainerElement.setAttribute("data-hint", "Toggle data mode.");
	this.modeContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.modeContainerElement.style.padding = "5px";
	this.modeContainerElement.onclick = $.proxy(function() {
		if (this.mode == "absolute") this.mode = "relative";
		else if (this.mode == "relative") this.mode = "absolute";
		this.updateEFP();
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/efpmode.png";
	this.modeContainerElement.appendChild(img);

	/* Retrieve diagram JSON */
	$.ajax({
		type: "GET",
		url: diagram,
		dataType: "json"
	}).done($.proxy(function(response) {
		this.width = response.width;
		this.height = response.height;

		this.webService = response.webService;

		var samples = [];

		/* Control samples */
		var control = response.control;
		this.control = {
			id: control.id,
			samples: [],
			source: control.source
		};
		for (var n = 0; n < control.samples.length; n++) {
			var sample = {
				name: control.samples[n],
				level: null
			};
			samples.push(sample);
			this.control.samples.push(sample);
		}

		/* Create outline */
		this.outline = new ZUI.ViewObject({
			shape: "advshape",
			x: -this.width / 2,
			y: -this.height / 2,
			paths: response.outline.paths,
			fill: false,
			strokeColor: response.outline.color || Eplant.Color.Black
		});

		/* Create groups */
		for (n = 0; n < response.groups.length; n++) {
			var group = response.groups[n];
			var _group = {};
			_group.highlight = false;
			_group.id = group.id;
			var obj = {
				group: _group,
				view: this
			};
			_group.shape = new ZUI.ViewObject({
				shape: "advshape",
				x: -this.width / 2,
				y: -this.height / 2,
				paths: group.paths,
				strokeWidth: 1,
				strokeColor: this.outline.strokeColor,
				fillColor: Eplant.Color.White,
				leftClick: $.proxy(function() {
					if (this.group.source) window.open(this.group.source);
				}, obj),
				mouseOver: $.proxy(function() {
					this.group.highlight = true;

					var groupTooltip = this.view.getGroupTooltip(this.group);
					if (!groupTooltip) {
						this.view.groupTooltipCountdown = {
							finish: ZUI.appStatus.progress + 500,
							group: this.group,
						};
					}

					ZUI.container.style.cursor = "pointer";
				}, obj),
				mouseOut: $.proxy(function() {
					this.group.highlight = false;

					var groupTooltip = this.view.getGroupTooltip(this.group);
					if (groupTooltip) {
						groupTooltip.remove();
						var index = this.view.groupTooltips.indexOf(groupTooltip);
						this.view.groupTooltips.splice(index, 1);
					}
					else if (this.view.groupTooltipCountdown && this.view.groupTooltipCountdown.group == this.group) {
						this.view.groupTooltipCountdown = null;
					}

					ZUI.container.style.cursor = "default";
				}, obj)
			});
			_group.outline = new ZUI.ViewObject({
				shape: "advshape",
				x: -this.width / 2,
				y: -this.height / 2,
				paths: group.paths,
				strokeWidth: 3,
				strokeColor: Eplant.Color.Green,
				fill: false
			});
			_group.color = Eplant.Color.White;
			_group.source = group.source;
			_group.samples = [];
			for (var m = 0; m < group.samples.length; m++) {
				var sample = {
					name: group.samples[m],
					level: null
				};
				samples.push(sample);
				_group.samples.push(sample);
			}
			this.viewObjects.push(_group.shape);
			this.groups.push(_group);
		}

		/* Query sample levels */
		var samplenames = [];
		for (var m = 0; m < samples.length; m++) {
			samplenames.push(samples[m].name);
		}
		$.getJSON(this.webService + "id=" + this.element.identifier + "&samples=" + JSON.stringify(samplenames), $.proxy(function(response) {
			for (var n = 0; n < response.length; n++) {
				for (var m = 0; m < this.samples.length; m++) {
					if (response[n].name == this.samples[m].name) {
						this.samples[m].level = Number(response[n].level);
						break;
					}
				}
			}
			this.view.updateLevels();
			this.view.updateEFP();
		}, {
			samples: samples,
			view: this
		}));

		/* Create labels */
		this.labels = response.labels;
		for (n = 0; n < this.labels.length; n++) {
			var label = this.labels[n];
			label.text = new ZUI.ViewObject({
				shape: "multilinetext",
				positionScale: "world",
				sizeScale: "world",
				x: label.x - this.width / 2,
				y: label.y - this.height / 2,
				centerAt: label.centerAt || "center center",
				content: label.content,
				size: label.size,
				font: label.font,
				bold: label.bold,
				italic: label.italic,
				underline: label.underline,
				strokeColor: label.color,
				fillColor: label.color,
				leftClick: $.proxy(function() {
					if (this.link) window.open(this.link);
				}, label),
				mouseOver: $.proxy(function() {
					if (this.link) ZUI.container.style.cursor = "pointer";
				}, label),
				mouseOut: $.proxy(function() {
					if (this.link) ZUI.container.style.cursor = "default";
				}, label)
			});
			this.viewObjects.push(label.text);
		}
	}, this));
}

/* Inherit from View superclass */
EFPView.prototype = new ZUI.View();
EFPView.prototype.constructor = EFPView;

EFPView.prototype.active = function() {
	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.modeContainerElement);
};

EFPView.prototype.inactive = function() {
	/* Remove tooltips */
	for (n = 0; n < this.groupTooltips.length; n++) {
		this.groupTooltips[n].remove();
	}
	this.groupTooltips = [];

	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";
};

EFPView.prototype.draw = function() {
	/* Update camera */
	ZUI.camera.update();

	/* Draw group shapes */
	for (n = 0; n < this.groups.length; n++) {
		this.groups[n].shape.draw();
	}

	/* Draw outline */
	if (this.outline) this.outline.draw();

	/* Stroke group shape, if highlighted */
	for (n = 0; n < this.groups.length; n++) {
		if (this.groups[n].highlight) {
			this.groups[n].outline.draw();
		}
	}

	/* Draw labels */
	for (var n = 0; n < this.labels.length; n++) {
		this.labels[n].text.draw();
	}

	/* Create group tooltip */
	if (this.groupTooltipCountdown && this.groupTooltipCountdown.finish <= ZUI.appStatus.progress) {
		var conf = this.groupTooltipCountdown;
		var tooltipAttr = {};
		if (this.mode == "absolute") {
			tooltipAttr.content = conf.group.id + "<br>Mean: " + (+parseFloat(conf.group.meanLevel).toFixed(2)) + "<br>Standard error: " + (+parseFloat(conf.group.stdevLevel).toFixed(2)) + "<br>Sample size: " + conf.group.nLevel;
		}
		else if (this.mode == "relative") {
			tooltipAttr.content = conf.group.id + "<br>Log2 value: " + (+parseFloat(ZUI.Math.log(conf.group.meanLevel / this.control.meanLevel, 2)).toFixed(2)) + "<br>Fold difference: " + (+parseFloat(conf.group.meanLevel / this.control.meanLevel).toFixed(2));
		}
		var groupTooltip = new Eplant.Tooltip(tooltipAttr);
		groupTooltip.data.group = conf.group;
		this.groupTooltips.push(groupTooltip);
		this.groupTooltipCountdown = null;
	}
};

EFPView.prototype.updateLevels = function() {
	/* Calculate mean and standard deviation, also get maximum level */
	this.maxLevel = 0;
	this.minLevel = Number.NaN;
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var values = [];
		for (var m = 0; m < group.samples.length; m++) {
			var sample = group.samples[m];
			if (!isNaN(sample.level)) {
				values.push(sample.level);
			}
		}
		group.meanLevel = ZUI.Statistics.mean(values);
		group.nLevel = values.length;
		group.stdevLevel = ZUI.Statistics.stdev(values);
		group.sterrorLevel = ZUI.Statistics.sterror(values);
		if (group.meanLevel > this.maxLevel) this.maxLevel = group.meanLevel;
		if (isNaN(this.minLevel) || group.meanLevel < this.minLevel) this.minLevel = group.meanLevel;
	}

	/* Control */
	var values = [];
	for (var m = 0; m < this.control.samples.length; m++) {
		var sample = this.control.samples[m];
		if (!isNaN(sample.level)) {
			values.push(sample.level);
		}
	}
	this.control.meanLevel = ZUI.Statistics.mean(values);
	this.control.nLevel = values.length;
	this.control.stdevLevel = ZUI.Statistics.stdev(values);
	this.control.sterrorLevel = ZUI.Statistics.sterror(values);

	this.isDataReady = true;
};

EFPView.prototype.updateEFP = function() {
	if (!this.isDataReady) return;

	/* Update eFP */
	if (this.mode == "absolute") {
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var levelRatio = group.meanLevel / this.maxLevel;
			if (isNaN(levelRatio)) {
				group.color = "#000000";
			}
			else {
				var green = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
				if (green.length < 2) green = "0" + green;
				group.color = "#FF" + green + "00";
//				var red = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
//				if (red.length < 2) red = "0" + red;
//				group.color = "#" + red + "FF00";
			}
			group.shape.fillColor = group.color;
		}
	}
	else if (this.mode == "relative") {
		var max = ZUI.Math.log(this.maxLevel / this.control.meanLevel, 2);
		var min = ZUI.Math.log(this.minLevel / this.control.meanLevel, 2);
		var cap = (Math.abs(max) > Math.abs(min)) ? Math.abs(max) : Math.abs(min);
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var log2Level = ZUI.Math.log(group.meanLevel / this.control.meanLevel, 2);
			var levelRatio = log2Level / cap;
			if (isNaN(levelRatio)) {
				group.color = "#000000";
			}
			else {
				if (levelRatio > 0) {
					var green = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
					if (green.length < 2) green = "0" + green;
					group.color = "#FF" + green + "00";
//					var red = Math.round((1 - levelRatio) * 255).toString(16).toUpperCase();
//					if (red.length < 2) red = "0" + red;
//					group.color = "#" + red + "FF00";
				}
				else {
					var redgreen = Math.round((1 + levelRatio) * 255).toString(16).toUpperCase();
					if (redgreen.length < 2) redgreen = "0" + redgreen;
					var blue = Math.round(-levelRatio * 255).toString(16).toUpperCase();
					if (blue.length < 2) blue = "0" + blue;
//					var green = Math.round((1 + levelRatio) * 255).toString(16).toUpperCase();
//					if (green.length < 2) green = "0" + green;
					group.color = "#" + redgreen + redgreen + blue;
//					group.color = "#FF" + green + "00";
				}

			}
			group.shape.fillColor = group.color;
		}
	}
};

EFPView.prototype.getGroupTooltip = function(group) {
	for (var n = 0; n < this.groupTooltips.length; n++) {
		if (this.groupTooltips[n].data.group == group) {
			return this.groupTooltips[n];
		}
	}
	return null;
};

EFPView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};
