(function() {

/**
 * Eplant.Views.WorldView class
 * Coded by Hans Yu
 * UI designed by Jamie Waese
 *
 * ePlant View for browsing gene expression data of plant tissues during development as eFP.
 *
 * @constructor
 * @augments Eplant.BaseViews.EFPView
 * @param {Eplant.GeneticElement} geneticElement The GeneticElement associated with this view.
 */
Eplant.Views.WorldView = function(geneticElement) {
	// Get constructor
	var constructor = Eplant.Views.WorldView;

	// Call parent constructor
	Eplant.View.call(this,
		constructor.viewName,				// Name of the View visible to the user
		constructor.hierarchy,			// Hierarchy of the View
		constructor.magnification,			// Magnification level of the View
		constructor.description,			// Description of the View visible to the user
		constructor.citation,			// Citation template of the View
		constructor.activeIconImageURL,		// URL for the active icon image
		constructor.availableIconImageURL,		// URL for the available icon image
		constructor.unavailableIconImageURL	// URL for the unavailable icon image
	);

	// Call eFP constructor
	var efpURL = "data/world/" + geneticElement.species.scientificName.replace(" ", "_") + ".json";
	Eplant.BaseViews.EFPView.call(this, geneticElement, efpURL, {
	});

	/* Attributes */
	this.markerIcon = null;		// Marker icon definition
};
ZUI.Util.inheritClass(Eplant.BaseViews.EFPView, Eplant.Views.WorldView);	// Inherit parent prototype

/* Define ePlant View properties */
Eplant.Views.WorldView.viewName = "World eFP Viewer";		// Name of the View visible to the user
Eplant.Views.WorldView.hierarchy = "genetic element";	// Hierarchy of the View
Eplant.Views.WorldView.magnification = 10;			// Magnification level of the View
Eplant.Views.WorldView.description = "World eFP viewer";	// Description of the View visible to the user
Eplant.Views.WorldView.citaiton = "";			// Citation template of the View
Eplant.Views.WorldView.activeIconImageURL = "img/active/world.png";		// URL for the active icon image
Eplant.Views.WorldView.availableIconImageURL = "img/available/world.png";		// URL for the available icon image
Eplant.Views.WorldView.unavailableIconImageURL = "img/unavailable/world.png";	// URL for the unavailable icon image

/* Static constants */
Eplant.Views.WorldView.map = null;			// GoogleMaps object
Eplant.Views.WorldView.domContainer = null;	// DOM container for GoogleMaps
Eplant.Views.WorldView.oms = null;			// OverlappingMarkerSpiderfier object

/* Static methods */
Eplant.Views.WorldView.initialize = function() {
	/* Get GoogleMaps DOM container */
	Eplant.Views.WorldView.domContainer = document.getElementById("map_container");

	/* Create GoogleMaps object */
	Eplant.Views.WorldView.map = new google.maps.Map(Eplant.Views.WorldView.domContainer, {
		center: new google.maps.LatLng(25, 0),
		zoom: 21,
		streetViewControl: false
	});

	/* Create OverlappingMarkerSpiderfier object */
	Eplant.Views.WorldView.oms = new OverlappingMarkerSpiderfier(Eplant.Views.WorldView.map, {
		markersWontMove: true,
		markersWontHide: true
	});
};

/**
 * Active callback method.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.active = function() {
	/* Call parent method */
	Eplant.BaseViews.EFPView.prototype.active.call(this);

	/* Disable pointer events for ZUI canvas */
	ZUI.disablePointerEvents();

	/* Show map */
	$(Eplant.Views.WorldView.domContainer).css({"visibility": "visible"});

	/* Reset map zoom and position */
	Eplant.Views.WorldView.map.setCenter(new google.maps.LatLng(25, 0));
	Eplant.Views.WorldView.map.setZoom(2);

	/* Insert markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		group.marker.setMap(Eplant.Views.WorldView.map);
		Eplant.Views.WorldView.oms.addMarker(group.marker);
	}
};

/**
 * Inactive callback method.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.inactive = function() {
	/* Call parent method */
	Eplant.BaseViews.EFPView.prototype.inactive.call(this);

	/* Restore point events for ZUI canvas */
	ZUI.restorePointerEvents();

	/* Hide map */
	$(Eplant.Views.WorldView.domContainer).css({"visibility": "hidden"});

	/* Remove markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		group.marker.setMap(null);
	}
	Eplant.Views.WorldView.oms.clearMarkers();
};

/**
 * Draw callback method.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.draw = function() {
	/* Call parent method */
	Eplant.View.prototype.draw.call(this);

	/* Draw tags */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.draw();
	}
};

/**
 * Clean up view.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.remove = function() {
	/* Call parent method */
	Eplant.View.prototype.remove.call(this);

	/* Remove ViewObjects */
	for (var n = 0; n < this.tagVOs.length; n++) {
		var tagVO = this.tagVOs[n];
		tagVO.remove();
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
Eplant.Views.WorldView.prototype.mouseMove = function() {
};

/**
 * MouseWheel callback method.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.mouseWheel = function() {
};

/**
 * Loads eFP definition and data.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.loadData = function() {
	/* Get eFP definition */
	$.getJSON(this.efpURL, $.proxy(function(response) {
		/* Get web service URL */
		this.webService = response.webService;

		/* Get marker shape */
		this.markerIcon = response.marker;

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
				position: {
					lat: groupData.position.lat,
					lng: groupData.position.lng
				},
				tooltip: null
			};

			/* Prepare wrapper object for proxy */
			var wrapper = {
				group: group,
				eFPView: this
			};

			/* Create marker */
			group.marker = new google.maps.Marker({
				position: new google.maps.LatLng(group.position.lat, group.position.lng),
				icon: this.getMarkerIcon(group.color)
			});
			group.marker.data = group;

			/* Bind mouseover event for marker */
			google.maps.event.addListener(group.marker, "mouseover", $.proxy(function() {
				/* Save mouse position */
				var x = ZUI.mouseStatus.x;
				var y = ZUI.mouseStatus.y;

				/* Get marker position */
				var overlay = new google.maps.OverlayView();
				overlay.draw = function() {};
				overlay.setMap(Eplant.Views.WorldView.map);
				var point = overlay.getProjection().fromLatLngToContainerPixel(this.group.marker.getPosition());

				/* Create tooltip */
				ZUI.mouseStatus.x = point.x;
				ZUI.mouseStatus.y = point.y - 15;
				var tooltipContent = "";
				if (this.eFPView.mode == "absolute") {
					tooltipContent = this.group.id + 
						"<br>Mean: " + (+parseFloat(this.group.mean).toFixed(2)) + 
						"<br>Standard error: " + (+parseFloat(this.group.stdev).toFixed(2)) + 
						"<br>Sample size: " + this.group.n;
				}
				else if (this.eFPView.mode == "relative") {
					tooltipContent = this.group.id + 
						"<br>Log2 value: " + (+parseFloat(ZUI.Math.log(this.group.mean / this.eFPView.control.mean, 2)).toFixed(2)) + 
						"<br>Fold difference: " + (+parseFloat(this.group.mean / this.eFPView.control.mean).toFixed(2));
				}
				else if (this.eFPView.mode == "compare") {
					var index = this.eFPView.groups.indexOf(this.group);
					var compareGroup = this.eFPView.compareEFPView.groups[index];
					tooltipContent = this.group.id + 
						"<br>Log2 value: " + (+parseFloat(ZUI.Math.log(this.group.mean / compareGroup.group.mean, 2)).toFixed(2)) + 
						"<br>Fold difference: " + (+parseFloat(this.group.mean / compareGroup.group.mean).toFixed(2));
				}
				this.group.tooltip = new Eplant.Tooltip({
					content: tooltipContent
				});

				/* Restore mouse position */
				ZUI.mouseStatus.x = x;
				ZUI.mouseStatus.y = y;
			}, wrapper));

			/* Bind mouseout event for marker */
			google.maps.event.addListener(group.marker, "mouseout", $.proxy(function() {
				if (this.group.tooltip) {
					this.group.tooltip.close();
					this.group.tooltip = null;
				}
			}, wrapper));

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

		/* Insert markers to map if this view is active */
		if (ZUI.activeView == this) {
			for (var n = 0; n < this.groups.length; n++) {
				var group = this.groups[n];
				group.marker.setMap(Eplant.Views.WorldView.map);
				Eplant.Views.WorldView.oms.addMarker(group.marker);
			}
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
 * Updates eFP.
 *
 * @override
 */
Eplant.Views.WorldView.prototype.updateEFP = function() {
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
			group.marker.setIcon(this.getMarkerIcon(group.color));
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
			group.marker.setIcon(this.getMarkerIcon(group.color));
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
			group.marker.setIcon(this.getMarkerIcon(group.color));
		}
	}

	/* Apply masking */
	if (this.isMaskOn) {
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			if (isNaN(group.sterror) || group.sterror >= group.mean * this.maskThreshold) {
				group.color = this.maskColor;
				group.marker.setIcon(this.getMarkerIcon(group.color));
			}
		}
	}

	/* Update legend */
	this.legend.update();
};

/**
 * Returns the data URL of an icon image.
 *
 * @param {String} color Color of the icon image.
 * @return {DOMString} Data URL of the icon image.
 */
Eplant.Views.WorldView.prototype.getMarkerIcon = function(color) {
	var _color = color;
	if (_color[0] == "#") _color = _color.substring(1);
	if (this.markerIcon) {
		var canvas = document.createElement("canvas");
		canvas.width = this.markerIcon.width;
		canvas.height = this.markerIcon.height;
		var context = canvas.getContext("2d");
		context.beginPath();
		for (var n = 0; n < this.markerIcon.paths.length; n++) {
			var instructions = ZUI.Parser.pathToObj(this.markerIcon.paths[n]);
			for (var m = 0; m < instructions.length; m++) {
				var instruction = instructions[m];
				context[instruction.instruction].apply(context, instruction.args);
			}
		}
		context.strokeStyle = "#000000";
		context.stroke();
		context.fillStyle = color;
		context.fill();

		return canvas.toDataURL("image/png");
	}
	else {
		return "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + _color;
	}
};

/**
 * Grabs the View's screen.
 *
 * @override
 * @return {DOMString}
 */
Eplant.Views.WorldView.prototype.getViewScreen = function() {
	return null;
};

/**
 * Returns the enter-out animation configuration.
 *
 * @override
 * @return {Object} The default enter-out animation configuration.
 */
Eplant.Views.WorldView.prototype.getEnterOutAnimationConfig = function() {
	/* Get default configuration */
	var config = Eplant.View.prototype.getEnterOutAnimationConfig.call(this);

	/* Modify configuration */
	config.begin = function() {
		Eplant.Views.WorldView.map.setCenter(new google.maps.LatLng(25, 0));
		Eplant.Views.WorldView.map.setZoom(21);
	};
	config.draw = function(elapsedTime, remainingTime, view, data) {
		var zoom = Math.round((21 - 2) * remainingTime / (elapsedTime + remainingTime) + 2);
		Eplant.Views.WorldView.map.setZoom(zoom);
	};
	config.end = function() {
		Eplant.Views.WorldView.map.setZoom(2);
	};

	/* Return configuration */
	return config;
};

/**
 * Returns the exit-in animation configuration.
 *
 * @override
 * @return {Object} The default exit-in animation configuration.
 */
Eplant.Views.WorldView.prototype.getExitInAnimationConfig = function() {
	/* Get default configuration */
	var config = Eplant.View.prototype.getExitInAnimationConfig.call(this);

	/* Modify configuration */
	config.data = {
		sourceZoom: Eplant.Views.WorldView.map.getZoom()
	};
	config.draw = function(elapsedTime, remainingTime, view, data) {
		var zoom = Math.round((21 - data.sourceZoom) * elapsedTime / (elapsedTime + remainingTime) + data.sourceZoom);
		Eplant.Views.WorldView.map.setZoom(zoom);
	};
	config.end = function() {
		Eplant.Views.WorldView.map.setZoom(21);
	};

	/* Return configuration */
	return config;
};

})();