/**
 * World View class
 * UI design by Jamie Waese
 * Code by Hans Yu
 */

function WorldView(elementOfInterest) {
	this.elementOfInterest = elementOfInterest;
	this.element = elementOfInterest.element;

	this.webService = null;
	this.control = null;
	this.groups = [];
	this.compareGroups = null;
	this.compareElement = null;

	this.tags = [];
	this.tagsUpdateEventListener = null;

	this.isDataReady = false;

	this.mode = "absolute";
	this.maskThreshold = 1;
	this.maskOn = false;

	this.maxLevel = 0;

	this.legend = new EFPView.Legend();

	EFPView.prototype.initIcons.call(this);

	/* Retrieve eFP JSON */
	$.getJSON("data/world/" + this.element.chromosome.species.scientificName.replace(" ", "_") + ".json", $.proxy(function(response) {
		this.webService = response.webService;

		this.marker = response.marker;

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

		/* Ecotypes */
		for (n = 0; n < response.groups.length; n++) {
			var group = response.groups[n];
			var _group = {};
			_group.view = this;
			_group.id = group.id;
			_group.source = group.source;
			_group.position = {
				lat: group.position.lat,
				lng: group.position.lng
			};
			_group.color = Eplant.Color.White;
			_group.samples = [];
			for (var m = 0; m < group.samples.length; m++) {
				var sample = {
					name: group.samples[m],
					level: null
				};
				samples.push(sample);
				_group.samples.push(sample);
			}

			/* Create marker */
			_group.marker = new google.maps.Marker({
				position: new google.maps.LatLng(_group.position.lat, _group.position.lng),
				icon: this.getMarkerIcon(_group.color)
			});
			_group.marker.data = group;

			/* Create info window */
			_group.infoWindow = new google.maps.InfoWindow({
				content: _group.id,
				disableAutoPan: true,
				closeBoxURL: ""
			});
			google.maps.event.addListener(_group.marker, "mouseover", $.proxy(function() {
				var x = ZUI.mouseStatus.x;
				var y = ZUI.mouseStatus.y;
				var overlay = new google.maps.OverlayView();
				overlay.draw = function() {};
				overlay.setMap(WorldView.googleMap);
				var point = overlay.getProjection().fromLatLngToContainerPixel(this.marker.getPosition());
				ZUI.mouseStatus.x = point.x;
				ZUI.mouseStatus.y = point.y - 15;
				var tooltipContent = "";
				if (this.view.mode == "absolute") {
					tooltipContent = this.id + "<br>Mean: " + (+parseFloat(this.meanLevel).toFixed(2)) + "<br>Standard error: " + (+parseFloat(this.stdevLevel).toFixed(2)) + "<br>Sample size: " + this.nLevel;
				}
				else if (this.view.mode == "relative") {
					tooltipContent = this.id + "<br>Log2 value: " + (+parseFloat(ZUI.Math.log(this.meanLevel / this.view.control.meanLevel, 2)).toFixed(2)) + "<br>Fold difference: " + (+parseFloat(this.meanLevel / this.view.control.meanLevel).toFixed(2));
				}
				else if (this.view.mode == "compare") {
					var index = this.view.groups.indexOf(this);
					var compareGroup = (index >= 0) ? this.view.compareGroups[index] : {};
					tooltipContent = this.id + "<br>Log2 value: " + (+parseFloat(ZUI.Math.log(this.meanLevel / compareGroup.meanLevel, 2)).toFixed(2)) + "<br>Fold difference: " + (+parseFloat(this.meanLevel / compareGroup.meanLevel).toFixed(2));
				}
				this.tooltip = new Eplant.Tooltip({
					content: tooltipContent
				});
				ZUI.mouseStatus.x = x;
				ZUI.mouseStatus.y = y;
			}, _group));
			google.maps.event.addListener(_group.marker, "mouseout", $.proxy(function() {
				if (this.tooltip) {
					this.tooltip.remove();
					this.tooltip = null;
				}
			}, _group));
			google.maps.event.addListener(_group.marker, "rightclick", $.proxy(function() {
				var overlay = new google.maps.OverlayView();
				overlay.draw = function() {};
				overlay.setMap(WorldView.googleMap);
				var point = overlay.getProjection().fromLatLngToContainerPixel(this.marker.getPosition());
				ZUI.customContextMenu.open(
					point.x, point.y - 15,
					[
						new ZUI.ContextMenuOption("Data source", function(data) {
							window.open(data.source);
						}, this, (this.source) ? true : false)
					]
				);
				if (this.tooltip) {
					this.tooltip.remove();
					this.tooltip = null;
				}
			}, _group));
			this.groups.push(_group);

			if (ZUI.activeView == this) {
				var marker = _group.marker;
				marker.setMap(WorldView.googleMap);
				WorldView.oms.addMarker(marker);
			}
		}

		/* Query sample levels */
		var samplenames = [];
		for (var m = 0; m < samples.length; m++) {
			samplenames.push(samples[m].name);
		}
		$.getJSON(this.webService + "id=" + this.element.identifier + "&samples=" + JSON.stringify(samplenames), $.proxy(function(response) {
			for (var m = 0; m < this.samples.length; m++) {
				for (var n = 0; n < response.length; n++) {
					if (response[n].name == this.samples[m].name) {
						this.samples[m].level = Number(response[n].value);
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
	}, this));
}

/* Inherit from View superclass */
WorldView.prototype = new ZUI.View();
WorldView.prototype.constructor = WorldView;

WorldView.initGoogleMaps = function() {
	google.maps.visualRefresh = false;

	WorldView.container = document.getElementById("map_container");
	WorldView.googleMap = new google.maps.Map(WorldView.container, {
		center: new google.maps.LatLng(25, 0),
		zoom: 21,
		streetViewControl: false
	});

	WorldView.oms = new OverlappingMarkerSpiderfier(WorldView.googleMap, {
		markersWontMove: true,
		markersWontHide: true
	});

	google.maps.event.addListener(WorldView.googleMap, "mousedown", function(event) {
		if (ZUI.customContextMenu.active) {
			ZUI.customContextMenu.close();
		}
	});
};

WorldView.prototype.getMarkerIcon = function(color) {
	var _color = color;
	if (_color[0] == "#") _color = _color.substring(1);
	if (this.marker) {
		var canvas = document.createElement("canvas");
		canvas.width = this.marker.width;
		canvas.height = this.marker.height;
		var context = canvas.getContext("2d");
		context.beginPath();
		for (var n = 0; n < this.marker.paths.length; n++) {
			var instructions = ZUI.Parser.pathToObj(this.marker.paths[n]);
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

WorldView.prototype.active = function() {
	ZUI.container.style.cursor = "default";

	/* Append to view history */
	if (Eplant.viewHistory[Eplant.viewHistorySelected] != this) {
		Eplant.pushViewHistory(this);
	}

	/* Append view-specific UI */
	var viewSpecificUI = document.getElementById("viewSpecificUI");
	viewSpecificUI.appendChild(this.modeContainerElement);
	viewSpecificUI.appendChild(this.compareContainerElement);
	viewSpecificUI.appendChild(this.maskContainerElement);
	viewSpecificUI.appendChild(this.legendContainerElement);

	WorldView.container.style.visibility = "visible";

	/* Insert markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var marker = group.marker;
		marker.setMap(WorldView.googleMap);
		WorldView.oms.addMarker(marker);
	}

	/* Show legend */
	if (!this.legend.visible) {
		this.legend.show();
	}

	/* Update tags */
	EFPView.prototype.updateTags.call(this);
	this.tagsUpdateEventListener = new ZUI.EventListener("update-tags", this.elementOfInterest, function(event, eventData, listenerData) {
		var view = listenerData.view;
		EFPView.prototype.updateTags.call(view);
	}, {
		view: this
	});
	ZUI.addEventListener(this.tagsUpdateEventListener);

	/* Disable point events setting for ZUI canvas */
	ZUI.disablePointerEvents();
};

WorldView.prototype.inactive = function() {
	/* Remove application specific UI */
	document.getElementById("viewSpecificUI").innerHTML = "";

	WorldView.container.style.visibility = "hidden";

	/* Remove markers */
	for (var n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		var marker = group.marker;
		group.marker.setMap(null);
		WorldView.oms.clearMarkers();
	}

	/* Remove tooltips */
	for (n = 0; n < this.groups.length; n++) {
		var group = this.groups[n];
		if (group.tooltip) {
			group.tooltip.remove();
			group.tooltip = null;
		}
	}

	/* Hide legend */
	if (this.legend.visible) {
		this.legend.hide();
	}

	/* Remove tags update listener */
	ZUI.removeEventListener(this.tagsUpdateEventListener);

	/* Restore point events setting for ZUI canvas */
	ZUI.restorePointerEvents();
};

WorldView.prototype.draw = function() {
	/* Draw tags */
	for (n = 0; n < this.tags.length; n++) {
		this.tags[n].draw();
	}
};

WorldView.prototype.updateLevels = function() {
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

WorldView.prototype.updateEFP = function() {
	if (!this.isDataReady) return;

	var maskColor = Eplant.Color.LightGrey;

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
			group.marker.setIcon(this.getMarkerIcon(group.color));
		}

		/* Update legend */
		var midColor = {
			red: Math.round((maxColor.red + minColor.red) / 2),
			green: Math.round((maxColor.green + minColor.green) / 2),
			blue: Math.round((maxColor.blue + minColor.blue) / 2)
		};
		this.legend.update(0, max / 2, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), maskColor, this.maskThreshold, "Linear", "Absolute");
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
			group.marker.setIcon(this.getMarkerIcon(group.color));
		}

		/* Update legend */
		this.legend.update(-max, 0, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), maskColor, this.maskThreshold, "Log2 Ratio", "Relative to control: " + (+parseFloat(this.control.meanLevel).toFixed(2)));
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
			group.marker.setIcon(this.getMarkerIcon(group.color));
		}

		/* Update legend */
		this.legend.update(-max, 0, max, ZUI.Util.makeColorString(minColor), ZUI.Util.makeColorString(midColor), ZUI.Util.makeColorString(maxColor), maskColor, this.maskThreshold, "Log2 Ratio", "Relative to " + this.compareElement.identifier);
	}

	/* Mask */
	if (this.maskOn) {
		for (var n = 0; n < this.groups.length; n++) {
			var group = this.groups[n];
			if (isNaN(group.sterrorLevel) || group.sterrorLevel >= group.meanLevel * this.maskThreshold) {
				group.color = maskColor;
				group.marker.setIcon(this.getMarkerIcon(group.color));
			}
		}
	}
};

WorldView.prototype.toCompareMode = function(elementOfInterest) {
	EFPView.prototype.toCompareMode.call(this, elementOfInterest);
};

WorldView.prototype.getLoadProgress = function() {
	if (this.isDataReady) return 1;
	else return 0;
};

WorldView.prototype.getZoomOutEntryAnimationSettings = function() {
	return {
		view: this,
		duration: 1000,
		begin: function() {
			WorldView.googleMap.setCenter(new google.maps.LatLng(25, 0));
			WorldView.googleMap.setZoom(21);
		},
		draw: function(elapsedTime, remainingTime, view, data) {
			var zoom = Math.round((21 - 2) * remainingTime / (elapsedTime + remainingTime) + 2);
			WorldView.googleMap.setZoom(zoom);
		},
		end: function() {
			WorldView.googleMap.setZoom(2);
		}
	};
};

WorldView.prototype.getZoomInExitAnimationSettings = function() {
	return {
		view: this,
		duration: 1000,
		data: {
			sourceZoom: WorldView.googleMap.getZoom()
		},
		draw: function(elapsedTime, remainingTime, view, data) {
			var zoom = Math.round((21 - data.sourceZoom) * elapsedTime / (elapsedTime + remainingTime) + data.sourceZoom);
			WorldView.googleMap.setZoom(zoom);
		},
		end: function() {
			WorldView.googleMap.setZoom(21);
		}
	};
};
