(function() {

/**
 * Eplant.BaseViews.EFPView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * @constructor
 * @augments Eplant.View
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement that this EFPView is associated with.
 * @param {String} efpURL The URL of the EFP definition file.
 * @param {Object} configs Configurations.
 * @param {Boolean} configs.isRelativeEnabled Whether relative mode is enabled.
 * @param {Boolean} configs.isCompareEnabled Whether compare mode is enabled.
 * @param {Boolean} configs.isMaskEnabled Whether masking is enabled.
 */
Eplant.BaseViews.EFPView = function(geneticElement, efpURL, configs) {
	/* Attributes */
	this.geneticElement = geneticElement;	// The GeneticElement that this EFPView is associated with
	this.efpURL = efpURL;			// The URL of the EFP definition file
	this.width = null;				// Width of the eFP
	this.height = null;				// Height of the eFP
	this.webService = null;			// URL of the web service for retrieving sample data
	this.control = null;				// Object for control
	this.outlineVO = null;			// ViewObject for eFP outline
	this.groups = [];				// Array of groups
	this.labels = [];				// Array of labels
	this.modeButton = null;			// Mode ViewSpecificUIButton
	this.compareButton = null;			// Compare ViewSpecificUIButton
	this.maskButton = null;			// Mask ViewSpecificUIButton
	this.isMaskOn = false;			// Whether masking is on
	this.maskThreshold = 1;			// Masking threshold
	this.tagVOs = [];				// Array of tag ViewObjects
	this.updateAnnotationTagsEventListener	// EventListener for update-annotationTags, for updating tags in this view
	this.legend = null;				// Legend object
	this.minColor = "#0000FF";			// Minimum color
	this.midColor = "#FFFF00";			// Middle color
	this.maxColor = "#FF0000";			// Maximum color
	this.maskColor = "#B4B4B4";			// Mask color
	this.errorColor = "#FFFFFF";		// Error color
	this.isRelativeEnabled = true;		// Whether relative mode is enabled
	this.isCompareEnabled = true;		// Whether compare mode is enabled
	this.isMaskEnabled = true;			// Whether masking is enabled
	this.compareEFPView = null;			// EFP view for comparing to
	this.mode = "absolute";			// EFP mode
	this.tooltipInfo = null;			// Information for creating tooltip

	/* Apply configurations */
	if (configs) {
		if (configs.isRelativeEnabled !== undefined) {
			this.isRelativeEnabled = configs.isRelativeEnabled;
		}
		if (configs.isCompareEnabled !== undefined) {
			this.isCompareEnabled = configs.isCompareEnabled;
		}
		if (configs.isMaskEnabled !== undefined) {
			this.isMaskEnabled = configs.isMaskEnabled;
		}
	}

	/* Create view-specific UI buttons */
	this.createViewSpecificUIButtons();

	/* Load data */
	this.loadData();

	/* Create legend */
	this.legend = new Eplant.BaseViews.EFPView.Legend(this);

	/* Bind events */
	this.bindEvents();
};
ZUI.Helper.inheritClass(Eplant.View, Eplant.BaseViews.EFPView);	// Inherit parent prototype

/**
 * Active callback method.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.active = function() {
	/* Call parent method */
	Eplant.View.prototype.active.call(this);

	/* Attach legend */
	if (this.legend.isVisible) {
		this.legend.attach();
	}
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.inactive = function() {
	/* Call parent method */
	Eplant.View.prototype.inactive.call(this);

	/* Detach legend */
	if (this.legend.isVisible) {
		this.legend.detach();
	}

	/* Remove tooltip info */
	if (this.tooltipInfo) {
		this.tooltipInfo = null;
	}

	/* Remove tooltips */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		if (group.tooltip) {
			group.tooltip.remove();
			group.tooltip = null;
		}
	}
};

/**
 * Draw callback method.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.draw = function() {
	/* Call parent method */
	Eplant.View.prototype.draw.call(this);

	/* Draw groups */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		group.vo.draw();
	}

	/* Draw outline */
	if (this.outlineVO) {
		this.outlineVO.draw();
	}

	/* Draw group outlines */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		if (group.isHighlight) {
			group.outlineVO.draw();
		}
	}

	/* Draw labels */
	for (var n = 0; n < this.labels.length; n++) {
		var label = this.labels[n];
		label.vo.draw();
	}

	/* Draw tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.draw();
	}

	/* Create tooltip, if applicable */
	if (this.tooltipInfo && this.tooltipInfo.finish <= ZUI.appStatus.progress) {
		/* Get target group */
		var group = this.tooltipInfo.group;

		/* Generate content */
		var content;
		if (this.mode == "absolute") {
			content = group.id + 
				"<br>Mean: " + (+parseFloat(group.mean).toFixed(2)) + 
				"<br>Standard error: " + (+parseFloat(group.stdev).toFixed(2)) + 
				"<br>Sample size: " + group.n;
		}
		else if (this.mode == "relative") {
			content = group.id + 
				"<br>Log2 value: " + (+parseFloat(ZUI.Math.log(group.mean / this.control.mean, 2)).toFixed(2)) + 
				"<br>Fold difference: " + (+parseFloat(group.mean / this.control.mean).toFixed(2));
		}
		else if (this.mode == "compare") {
			var index = this.groups.indexOf(group);
			var compareGroup = this.compareEFPView.groups[index];
			content = group.id + 
				"<br>Log2 value: " + (+parseFloat(ZUI.Math.log(group.mean / compareGroup.mean, 2)).toFixed(2)) + 
				"<br>Fold difference: " + (+parseFloat(group.mean / compareGroup.mean).toFixed(2));
		}

		/* Create tooltip */
		group.tooltip = new Eplant.Tooltip({
			content: content
		});

		/* Remove tooltip info */
		this.tooltipInfo = null;
	}
};

/**
 * Clean up view.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.remove = function() {
	/* Call parent method */
	Eplant.View.prototype.remove.call(this);

	/* Remove ViewObjects */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.remove();
	}
	this.outlineVO.remove();
	for (var n = 0; n < this.labels.length; n++) {
		var label = this.labels[n];
		label.vo.remove();
	}
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		group.vo.remove();
		group.outlineVO.remove();
	}

	/* Remove legend */
	this.legend.remove();

	/* Remove EventListeners */
	ZUI.removeEventListener(this.updateAnnotationTagsEventListener);
};

/**
 * MouseMove callback method.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.mouseMove = function() {
	/* Check whether mouse is pressed down to determine behaviour */
	if (ZUI.mouseStatus.leftDown) {		// Down
		/* Pan camera */
		ZUI.camera.x -= ZUI.camera.unprojectDistance(ZUI.mouseStatus.x - ZUI.mouseStatus.xLast);
		ZUI.camera.y -= ZUI.camera.unprojectDistance(ZUI.mouseStatus.y - ZUI.mouseStatus.yLast);
	}
};

/**
 * MouseWheel callback method.
 *
 * @override
 */
Eplant.BaseViews.EFPView.prototype.mouseWheel = function(scroll) {
	/* Zoom at mouse position */
	var point = ZUI.camera.unprojectPoint(ZUI.mouseStatus.x, ZUI.mouseStatus.y);
	ZUI.camera.x += (point.x - ZUI.camera.x) * scroll * 0.1;
	ZUI.camera.y += (point.y - ZUI.camera.y) * scroll * 0.1;
	ZUI.camera.distance *= 1 - scroll * 0.1;
};

/**
 * Creates view-specific UI buttons.
 */
Eplant.BaseViews.EFPView.prototype.createViewSpecificUIButtons = function() {
	/* Mode */
	if (this.isRelativeEnabled) {
		this.modeButton = new Eplant.ViewSpecificUIButton(
			"img/efpmode-absolute.png",		// imageSource
			"Toggle data mode: absolute.",	// Description
			function(data) {			// click
				/* Update button */
				if (data.eFPView.mode == "absolute") {
					data.eFPView.mode = "relative";
					this.setImageSource("img/efpmode-relative.png");
					this.setDescription("Toggle data mode: relative.");
				}
				else if (data.eFPView.mode == "relative") {
					data.eFPView.mode = "absolute";
					this.setImageSource("img/efpmode-absolute.png");
					this.setDescription("Toggle data mode: absolute.");
				}

				/* Update eFP */
				data.eFPView.updateEFP();
			},
			{
				eFPView: this
			}
		);
		this.viewSpecificUIButtons.push(this.modeButton);
	}

	/* Compare */
	if (this.isRelativeEnabled && this.isCompareEnabled) {
		this.compareButton = new Eplant.ViewSpecificUIButton(
			"img/available/efpmode-compare.png",		// imageSource
			"Compare to another gene.",			// Description
			function(data) {				// click
				/* Check whether compare mode is already activated */
				if (data.eFPView.mode == "compare") {	// Yes
					/* Change mode to relative */
					data.eFPView.mode = "relative";

					/* Update mode button */
					data.eFPView.modeButton.setImageSource("img/efpmode-relative.png");
					data.eFPView.modeButton.setDescription("Toggle data mode: relative.");

					/* Update compare button */
					this.setImageSource("img/available/efpmode-compare.png");
					this.setDescription("Compare to another gene.");

					/* Update eFP */
					data.eFPView.updateEFP();
				}
				else {		// No
					/* Create compare dialog */
					var compareDialog = new Eplant.BaseViews.EFPView.CompareDialog(data.eFPView);
				}
			},
			{
				eFPView: this
			}
		);
		this.viewSpecificUIButtons.push(this.compareButton);
	}

	/* Mask */
	if (this.isMaskEnabled) {
		this.maskButton = new Eplant.ViewSpecificUIButton(
			"img/off/filter.png",		// imageSource
			"Mask data with below threshold confidence.",		// description
			function(data) {				// click
				/* Check whether masking is already on */
				if (data.eFPView.isMaskOn) {		// Yes
					/* Update button */
					this.setImageSource("img/off/filter.png");

					/* Turn off masking */
					data.eFPView.isMaskOn = false;

					/* Update eFP */
					data.eFPView.updateEFP();
				}
				else {		// No
					/* Create mask dialog */
					var maskDialog = new Eplant.BaseViews.EFPView.MaskDialog(data.eFPView);
				}
			},
			{
				eFPView: this
			}
		);
		this.viewSpecificUIButtons.push(this.maskButton);
	}

	/* Legend */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/legend.png",		// imageSource
		"Toggle legend.",		// description
		function(data) {		// click
			/* Check whether legend is showing */
			if (data.eFPView.legend.isVisible) {		// Yes
				/* Hide legend */
				data.eFPView.legend.hide();
			}
			else {		// No
				/* Show legend */
				data.eFPView.legend.show();
			}
		},
		{
			eFPView: this
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);

	/* Palette */
	var viewSpecificUIButton = new Eplant.ViewSpecificUIButton(
		"img/palette.png",		// imageSource
		"Set eFP colors.",		// description
		function(data) {		// click
			var paletteDialog = new Eplant.BaseViews.EFPView.PaletteDialog(data.eFPView);
		},
		{
			eFPView: this
		}
	);
	this.viewSpecificUIButtons.push(viewSpecificUIButton);
};

/**
 * Loads eFP definition and data.
 */
Eplant.BaseViews.EFPView.prototype.loadData = function() {
	/* Get eFP definition */
	$.getJSON(this.efpURL, $.proxy(function(response) {
		/* Get eFP size */
		this.width = response.width;
		this.height = response.height;

		/* Get web service URL */
		this.webService = response.webService;

		/* Prepare array for samples loading */
		var samples = [];

		/* Prepare control samples */
		var controlData = response.control;
		this.control = {
			id: controlData.id,
			samples: [],
			source: controlData.source
		};
		for (var n = 0; n < controlData.samples.length; n++) {
			var sample = {
				name: controlData.samples[n],
				value: null
			};
			samples.push(sample);
			this.control.samples.push(sample);
		}

		/* Create outline ViewObject */
		this.outlineVO = new ZUI.ViewObject({
			shape: "advshape",
			x: -this.width / 2,
			y: -this.height / 2,
			paths: response.outline.paths,
			fill: false,
			strokeColor: response.outline.color || Eplant.Color.Black
		});

		/* Create labels */
		this.labels = response.labels;
		for (var n = 0; n < this.labels.length; n++) {
			/* Get label */
			var label = this.labels[n];

			/* Create ViewObject */
			label.vo = new ZUI.ViewObject({
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
			this.viewObjects.push(label.vo);		// Append to ViewObjects array for user input detection
		}

		/* Create groups */
		this.groups = [];
		for (var n = 0; n < response.groups.length; n++) {
			/* Get group data */
			var groupData = response.groups[n];

			/* Create group object */
			var group = {
				id: groupData.id,
				samples: [],
				source: groupData.source,
				color: Eplant.Color.White,
				isHighlight: false,
				tooltip: null
			};

			/* Prepare wrapper object for proxy */
			var wrapper = {
				group: group,
				eFPView: this
			};

			/* Create ViewObject for group */
			group.vo = new ZUI.ViewObject({
				shape: "advshape",
				x: -this.width / 2,
				y: -this.height / 2,
				paths: groupData.paths,
				strokeWidth: 1,
				strokeColor: this.outlineVO.strokeColor,
				fillColor: Eplant.Color.White,
				mouseOver: $.proxy(function() {
					/* Set highlight to true */
					this.group.isHighlight = true;

					/* Change cursor style */
					ZUI.container.style.cursor = "pointer";

					/* Set tooltip info */
					if (!this.group.tooltip) {
						this.eFPView.tooltipInfo = {
							finish: ZUI.appStatus.progress + 500,
							group: this.group
						};
					}
				}, wrapper),
				mouseOut: $.proxy(function() {
					/* Set highlight to false */
					this.group.isHighlight = false;

					/* Restore cursor style */
					ZUI.container.style.cursor = "default";

					/* Close tooltip or remove tooltip info */
					if (this.group.tooltip) {
						this.group.tooltip.close();
						this.group.tooltip = null;
					}
					else {
						this.eFPView.tooltipInfo = null;
					}
				}, wrapper)
			});
			this.viewObjects.push(group.vo);	// Append to ViewObjects array for user input detection

			/* Create ViewObject for group outline */
			group.outlineVO = new ZUI.ViewObject({
				shape: "advshape",
				x: -this.width / 2,
				y: -this.height / 2,
				paths: groupData.paths,
				strokeWidth: 3,
				strokeColor: Eplant.Color.Black,
				fill: false
			});

			/* Prepare samples */
			for (var m = 0; m < groupData.samples.length; m++) {
				var sample = {
					name: groupData.samples[m],
					value: null
				};
				samples.push(sample);
				group.samples.push(sample);
			}

			/* Append group to array */
			this.groups.push(group);
		}

		/* Get sample values */
		/* Get sample names */
		var sampleNames = [];
		for (var n = 0; n < samples.length; n++) {
			sampleNames.push(samples[n].name);
		}
		/* Prepare wrapper for proxy */
		var wrapper = {
			samples: samples,
			eFPView: this
		};
		/* Query */
		$.getJSON(this.webService + "id=" + this.geneticElement.identifier + "&samples=" + JSON.stringify(sampleNames), $.proxy(function(response) {
			/* Match results with samples and copy values to samples */
			for (var n = 0; n < this.samples.length; n++) {
				for (var m = 0; m < response.length; m++) {
					if (this.samples[n].name == response[m].name) {
						this.samples[n].value = Number(response[m].value);
						break;
					}
				}
			}

			/* Process values */
			this.eFPView.processValues();

			/* Finish loading */
			this.eFPView.loadFinish();

			/* Update eFP */
			this.eFPView.updateEFP();
		}, wrapper));
	}, this));
};

/**
 * Binds events.
 */
Eplant.BaseViews.EFPView.prototype.bindEvents = function() {
	/* update-annotationTags */
	this.updateAnnotationTagsEventListener = new ZUI.EventListener("update-annotationTags", this.geneticElement, function(event, eventData, listenerData) {
		/* Get EFPView */
		var eFPView = listenerData.eFPView;

		/* Update tags */
		eFPView.updateTags();
	}, {
		eFPView: this
	});
	ZUI.addEventListener(this.updateAnnotationTagsEventListener);
};

/**
 * Calculates useful information from raw values.
 */
Eplant.BaseViews.EFPView.prototype.processValues = function() {
	/* Processes raw values for a group */
	function processGroupValues(group) {
		var values = [];
		for (var n = 0; n < group.samples.length; n++) {
			var sample = group.samples[n];
			if (!isNaN(sample.value)) {
				values.push(sample.value);
			}
		}
		group.mean = ZUI.Statistics.mean(values);
		group.n = values.length;
		group.stdev = ZUI.Statistics.stdev(values);
		group.sterror = ZUI.Statistics.sterror(values);
	}

	/* Control */
	processGroupValues(this.control);

	/* Groups */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		processGroupValues(group);
	}
};

/**
 * Updates eFP.
 */
Eplant.BaseViews.EFPView.prototype.updateEFP = function() {
	/* Return if data are not loaded */
	if (!this.isLoadedData) {
		return;
	}

	/* Update eFP */
	if (this.mode == "absolute") {
		/* Find maximum value */
		var max = this.groups[0].mean;
		for (var n = 1; n < this.groups.length; n++) {
			var group = this.groups[n];
			if (group.mean > max) {
				max = group.mean;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents(this.midColor);
		var maxColor = ZUI.Util.getColorComponents(this.maxColor);
		for (var n = 0; n < this.groups.length; n++) {
			/* Get group */
			var group = this.groups[n];

			/* Get value ratio relative to maximum */
			var ratio = group.mean / max;

			/* Check whether ratio is invalid */
			if (isNaN(ratio) || !isFinite(ratio)) {		// Invalid
				group.color = this.errorColor;
			}
			else {		// Valid
				var red = minColor.red + Math.round((maxColor.red - minColor.red) * ratio);
				var green = minColor.green + Math.round((maxColor.green - minColor.green) * ratio);
				var blue = minColor.blue + Math.round((maxColor.blue - minColor.blue) * ratio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}

			/* Set color of ViewObject */
			group.vo.fillColor = group.color;
		}
	}
	else if (this.mode == "relative") {
		/* Find extremum log2 value */
		var controlValue = this.control.mean;
		var extremum = Math.abs(ZUI.Math.log(this.groups[0].mean / controlValue, 2));
		for (var n = 1; n < this.groups.length; n++) {
			var group = this.groups[n];
			var absLog2Value = Math.abs(ZUI.Math.log(group.mean / controlValue, 2));
			if (absLog2Value > extremum) {
				extremum = absLog2Value;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents(this.minColor);
		var midColor = ZUI.Util.getColorComponents(this.midColor);
		var maxColor = ZUI.Util.getColorComponents(this.maxColor);
		for (var n = 0; n < this.groups.length; n++) {
			/* Get group */
			var group = this.groups[n];

			/* Get log2 value relative to control */
			var log2Value = ZUI.Math.log(group.mean / controlValue, 2);

			/* Get log2 value ratio relative to extremum */
			var ratio = log2Value / extremum;

			/* Check whether ratio is invalid */
			if (isNaN(ratio) || !isFinite(ratio)) {		// Invalid
				group.color = this.errorColor;
			}
			else {		// Valid
				var color1, color2;
				if (ratio < 0) {
					color1 = midColor;
					color2 = minColor;
					ratio *= -1;
				}
				else {
					color1 = midColor;
					color2 = maxColor;
				}
				var red = color1.red + Math.round((color2.red - color1.red) * ratio);
				var green = color1.green + Math.round((color2.green - color1.green) * ratio);
				var blue = color1.blue + Math.round((color2.blue - color1.blue) * ratio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}

			/* Set color of ViewObject */
			group.vo.fillColor = group.color;
		}
	}
	else if (this.mode == "compare") {
		/* Find extremum log2 value */
		var extremum = Math.abs(ZUI.Math.log(this.groups[0].mean / this.compareEFPView.groups[0].mean, 2));
		for (var n = 1; n < this.groups.length; n++) {
			var group = this.groups[n];
			var compareGroup = this.compareEFPView.groups[n];
			var absLog2Value = Math.abs(ZUI.Math.log(group.mean / compareGroup.mean, 2));
			if (absLog2Value > extremum) {
				extremum = absLog2Value;
			}
		}

		/* Color groups */
		var minColor = ZUI.Util.getColorComponents(this.minColor);
		var midColor = ZUI.Util.getColorComponents(this.midColor);
		var maxColor = ZUI.Util.getColorComponents(this.maxColor);
		for (var n = 0; n < this.groups.length; n++) {
			/* Get group */
			var group = this.groups[n];
			var compareGroup = this.compareEFPView.groups[n];

			/* Get log2 value relative to control */
			var log2Value = ZUI.Math.log(group.mean / compareGroup.mean, 2);

			/* Get log2 value ratio relative to extremum */
			var ratio = log2Value / extremum;

			/* Check whether ratio is invalid */
			if (isNaN(ratio) || !isFinite(ratio)) {		// Invalid
				group.color = this.errorColor;
			}
			else {		// Valid
				var color1, color2;
				if (ratio < 0) {
					color1 = midColor;
					color2 = minColor;
					ratio *= -1;
				}
				else {
					color1 = midColor;
					color2 = maxColor;
				}
				var red = color1.red + Math.round((color2.red - color1.red) * ratio);
				var green = color1.green + Math.round((color2.green - color1.green) * ratio);
				var blue = color1.blue + Math.round((color2.blue - color1.blue) * ratio);
				group.color = ZUI.Util.makeColorString(red, green, blue);
			}

			/* Set color of ViewObject */
			group.vo.fillColor = group.color;
		}
	}

	/* Apply masking */
	if (this.isMaskOn) {
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			if (isNaN(group.sterror) || group.sterror >= group.mean * this.maskThreshold) {
				group.color = this.maskColor;
				group.vo.fillColor = group.color;
			}
		}
	}

	/* Update legend */
	this.legend.update();
};

/**
 * Recreate tag ViewObjects
 */
Eplant.BaseViews.EFPView.prototype.updateTags = function() {
	/* Remove old tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.remove();
	}
	this.tagVOs = [];

	/* Create new tags */
	var selectedAnnotationTags = [];
	for (var n = 0; n < this.geneticElement.annotationTags.length; n++) {
		var annotationTag = this.geneticElement.annotationTags[n];
		if (annotationTag.isSelected) {
			selectedAnnotationTags.push(annotationTag);
		}
	}
	for (var n = 0; n < selectedAnnotationTags.length; n++) {
		var annotationTag = selectedAnnotationTags[n];
		this.tagVOs.push(new ZUI.ViewObject({
			shape: "circle",
			positionScale: "screen",
			sizeScale: "screen",
			x: ZUI.width - 20 - (selectedAnnotationTags.length - 1) * 8 + n * 8,
			y: ZUI.height - 13,
			radius: 3,
			centerAt: "center center",
			strokeColor: annotationTag.color,
			fillColor: annotationTag.color
		}));
	}
};

/**
 * Activates compare mode and compares data of this GeneticElement to the specified GeneticElement.
 */
Eplant.BaseViews.EFPView.prototype.compare = function(geneticElement) {
	/* Confirm GeneticElement that is compared to has views loaded */
	if (!geneticElement.isLoadedViews) {
		alert("Please load data for " + geneticElement.identifier + " first.");
		return;
	}

	/* Get name of the eFP view */
	var viewName = Eplant.getViewName(this);

	/* Switch to compare mode */
	this.compareEFPView = geneticElement.views[viewName];
	this.mode = "compare";

	/* Update mode button */
	this.modeButton.setImageSource("img/efpmode-relative.png");
	this.modeButton.setDescription("Data mode: compare. Click on Compare button to turn off.");

	/* Update compare button */
	this.compareButton.setImageSource("img/active/efpmode-compare.png");
	this.compareButton.setDescription("Turn off compare mode.");

	/* Update eFP */
	this.updateEFP();
};

})();