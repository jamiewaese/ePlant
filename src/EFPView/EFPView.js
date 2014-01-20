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
	this.compareGroups = null;
	this.compareElement = null;
	this.viewObjects = [];

	this.isDataReady = false;

	this.mode = "absolute";

	this.maxLevel = 0;
	this.minLevel = 0;

	this.legend = new EFPView.Legend();

	this.groupTooltips = [];
	this.groupTooltipCountdown = null;

	this.initIcons();

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
				strokeColor: Eplant.Color.Black,
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

EFPView.prototype.initIcons = function() {
	/* Create view-specific UI elements */
	this.modeContainerElement = document.createElement("div");
	this.modeContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.modeContainerElement.setAttribute("data-hint", "Toggle data mode (absolute).");
	this.modeContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.modeContainerElement.style.padding = "5px";
	this.modeContainerElement.onclick = $.proxy(function() {
		if (this.mode == "absolute") {
			this.mode = "relative";
			this.modeContainerElement.getElementsByTagName("img")[0].src = "img/efpmode-relative.png";
			this.modeContainerElement.setAttribute("data-hint", "Toggle data mode: relative.");
		}
		else if (this.mode == "relative") {
			this.mode = "absolute";
			this.modeContainerElement.getElementsByTagName("img")[0].src = "img/efpmode-absolute.png";
			this.modeContainerElement.setAttribute("data-hint", "Toggle data mode: absolute.");
		}
		this.updateEFP();
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/efpmode-absolute.png";
	this.modeContainerElement.appendChild(img);

	/* Compare */
	this.compareContainerElement = document.createElement("div");
	this.compareContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.compareContainerElement.setAttribute("data-hint", "Compare to another gene.");
	this.compareContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.compareContainerElement.style.padding = "5px";
	this.compareContainerElement.onclick = $.proxy(function() {
		if (this.mode == "compare") {
			this.mode = "relative";
			this.modeContainerElement.getElementsByTagName("img")[0].src = "img/efpmode-relative.png";
			this.modeContainerElement.setAttribute("data-hint", "Toggle data mode: relative.");
			this.compareContainerElement.getElementsByTagName("img")[0].src = "img/available/efpmode-compare.png";
			this.compareContainerElement.setAttribute("data-hint", "Compare to another gene.");
			this.updateEFP();
		}
		else {
			new EFPView.CompareDialog(this.element, this);
		}
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/available/efpmode-compare.png";
	this.compareContainerElement.appendChild(img);

	/* Legend */
	this.legendContainerElement = document.createElement("div");
	this.legendContainerElement.className = "iconSmall hint--top hint--success hint--rounded";
	this.legendContainerElement.setAttribute("data-hint", "Legend.");
	this.legendContainerElement.setAttribute("data-enabled", Eplant.tooltipSwitch.toString());
	this.legendContainerElement.style.padding = "5px";
	this.legendContainerElement.onclick = $.proxy(function() {
		if (this.legend.visible) {
			this.legend.hide();
		}
		else {
			this.legend.show();
		}
	}, this);
	/* Set icon */
	var img = document.createElement("img");
	img.src = "img/legend.png";
	this.legendContainerElement.appendChild(img);
};

EFPView.prototype.active = function() {
	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Show legend */
	if (!this.legend.visible) {
		this.legend.show();
	}
};

EFPView.prototype.inactive = function() {
	/* Remove tooltips */
	for (n = 0; n < this.groupTooltips.length; n++) {
		this.groupTooltips[n].remove();
	}
	this.groupTooltips = [];

	/* Hide legend */
	if (this.legend.visible) {
		this.legend.hide();
	}

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
		else if (this.mode == "compare") {
			var index = this.groups.indexOf(conf.group);
			var compareGroup = (index >= 0) ? this.compareGroups[index] : {};
			tooltipAttr.content = conf.group.id + "<br>Log2 value: " + (+parseFloat(ZUI.Math.log(conf.group.meanLevel / compareGroup.meanLevel, 2)).toFixed(2)) + "<br>Fold difference: " + (+parseFloat(conf.group.meanLevel / compareGroup.meanLevel).toFixed(2));
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
		/* Calculate max */
		var max = Number.NaN;
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			if (isNaN(group.meanLevel) || !isFinite(group.meanLevel)) {
				continue;
			}
			if (group.meanLevel > max || isNaN(max)) {
				max = group.meanLevel;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents("#FFFF00");
		var maxColor = ZUI.Util.getColorComponents("#FF0000");
		var errorColor = "#FFFFFF";
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var levelRatio = group.meanLevel / max;
			if (isNaN(levelRatio) || !isFinite(levelRatio)) {
				group.color = errorColor;
			}
			else {
				var red = minColor.red + Math.round((maxColor.red - minColor.red) * levelRatio);
				var green = minColor.green + Math.round((maxColor.green - minColor.green) * levelRatio);
				var blue = minColor.blue + Math.round((maxColor.blue - minColor.blue) * levelRatio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}
			group.shape.fillColor = group.color;
		}

		/* Update legend */
		var midColor = {
			red: Math.round((maxColor.red + minColor.red) / 2),
			green: Math.round((maxColor.green + minColor.green) / 2),
			blue: Math.round((maxColor.blue + minColor.blue) / 2)
		};
		this.legend.update(0, max / 2, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), "Linear", "Absolute");
	}
	else if (this.mode == "relative") {
		/* Calculate max */
		var max = Number.NaN;
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var absLog2Level = Math.abs(ZUI.Math.log(group.meanLevel / this.control.meanLevel, 2));
			if (isNaN(absLog2Level) || !isFinite(absLog2Level)) {
				continue;
			}
			if (absLog2Level > max || isNaN(max)) {
				max = absLog2Level;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents("#0000FF");
		var midColor = ZUI.Util.getColorComponents("#FFFF00");
		var maxColor = ZUI.Util.getColorComponents("#FF0000");
		var errorColor = "#FFFFFF";
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var log2Level = ZUI.Math.log(group.meanLevel / this.control.meanLevel, 2);
			var levelRatio = log2Level / max;
			if (isNaN(levelRatio) || !isFinite(levelRatio)) {
				group.color = errorColor;
			}
			else {
				var color1, color2;
				if (levelRatio < 0) {
					color1 = midColor;
					color2 = minColor;
					levelRatio *= -1;
				}
				else {
					color1 = midColor;
					color2 = maxColor;
				}
				var red = color1.red + Math.round((color2.red - color1.red) * levelRatio);
				var green = color1.green + Math.round((color2.green - color1.green) * levelRatio);
				var blue = color1.blue + Math.round((color2.blue - color1.blue) * levelRatio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}
			group.shape.fillColor = group.color;
		}

		/* Update legend */
		this.legend.update(-max, 0, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), "Log2 Ratio", "Relative to control: " + (+parseFloat(this.control.meanLevel).toFixed(2)));
	}
	else if (this.mode == "compare") {
		/* Calculate ratios and max */
		var ratios = [];
		var max = Number.NaN;
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var compareGroup = this.compareGroups[n];
			var ratio = group.meanLevel / compareGroup.meanLevel;
			ratios.push(ratio);
			var absLog2Level = Math.abs(ZUI.Math.log(ratio, 2));
			if (isNaN(absLog2Level) || !isFinite(absLog2Level)) {
				continue;
			}
			if (absLog2Level > max || isNaN(max)) {
				max = absLog2Level;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents("#0000FF");
		var midColor = ZUI.Util.getColorComponents("#FFFF00");
		var maxColor = ZUI.Util.getColorComponents("#FF0000");
		var errorColor = "#FFFFFF";
		for (n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			var log2Level = ZUI.Math.log(ratios[n], 2);
			var levelRatio = log2Level / max;
			if (isNaN(levelRatio) || !isFinite(levelRatio)) {
				group.color = errorColor;
			}
			else {
				var color1, color2;
				if (levelRatio < 0) {
					color1 = midColor;
					color2 = minColor;
					levelRatio *= -1;
				}
				else {
					color1 = midColor;
					color2 = maxColor;
				}
				var red = color1.red + Math.round((color2.red - color1.red) * levelRatio);
				var green = color1.green + Math.round((color2.green - color1.green) * levelRatio);
				var blue = color1.blue + Math.round((color2.blue - color1.blue) * levelRatio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}
			group.shape.fillColor = group.color;
		}

		/* Update legend */
		this.legend.update(-max, 0, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), "Log2 Ratio", "Relative to " + this.compareElement.identifier);
	}
};

EFPView.prototype.toCompareMode = function(elementOfInterest) {
	var _elementOfInterest = Eplant.getSpeciesOfInterest(this.element.chromosome.species).getElementOfInterest(this.element);
	if (!_elementOfInterest) return;
	var viewName = null;
	for (key in _elementOfInterest) {
		if (_elementOfInterest[key] === this) {
			viewName = key;
			break;
		}
	}
	if (viewName) {
		this.compareGroups = elementOfInterest[viewName].groups;
		this.compareElement = elementOfInterest.element;
		this.mode = "compare";
		this.modeContainerElement.getElementsByTagName("img")[0].src = "img/efpmode-relative.png";
		this.modeContainerElement.setAttribute("data-hint", "Data mode: compare. Click on Compare button to turn off.");
		this.compareContainerElement.getElementsByTagName("img")[0].src = "img/active/efpmode-compare.png";
		this.compareContainerElement.setAttribute("data-hint", "Turn off compare mode.");
		this.updateEFP();
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
